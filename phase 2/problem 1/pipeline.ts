type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

type Task<T, R> = {
  readonly id: string;
  readonly input: T;
  readonly fn: (data: T) => Promise<R>;
  status: TaskStatus;
  result?: R;
  error?: Error;
  attempts: number;
};

type TaskState<T, R> = Readonly<Task<T, R>>;

type PipelineEvents<T, R> = {
  taskStart: TaskState<T, R>;
  taskSuccess: TaskState<T, R>;
  taskFailed: TaskState<T, R>;
  taskRetry: TaskState<T, R>;
};

type Listener<D> = (data: D) => void;

function isError(val: unknown): val is Error {
  return val instanceof Error;
}

function createEventEmitter<Events extends Record<string, unknown>>() {
  const handlers = new Map<keyof Events, Set<Listener<any>>>();

  return {
    on<K extends keyof Events>(event: K, fn: Listener<Events[K]>) {
      if (!handlers.has(event)) {
        handlers.set(event, new Set());
      }
      handlers.get(event)!.add(fn);
      return () => handlers.get(event)?.delete(fn);
    },
    emit<K extends keyof Events>(event: K, data: Events[K]) {
      handlers.get(event)?.forEach((fn) => fn(data));
    }
  };
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function executeWithRetry<T, R>(
  task: Task<T, R>,
  maxRetries: number,
  baseDelay: number,
  onRetry: () => void
): Promise<R> {
  while (true) {
    try {
      task.attempts++;
      return await task.fn(task.input);
    } catch (err) {
      if (task.attempts > maxRetries) {
        throw isError(err) ? err : new Error(String(err));
      }
      onRetry();
      const delay = baseDelay * Math.pow(2, task.attempts - 1);
      await sleep(delay);
    }
  }
}

export function createPipeline<T, R>(config: {
  concurrency: number;
  maxRetries?: number;
  baseDelay?: number;
}) {
  const { concurrency, maxRetries = 3, baseDelay = 100 } = config;
  const events = createEventEmitter<PipelineEvents<T, R>>();

  async function* run(inputs: T[], fn: (data: T) => Promise<R>): AsyncGenerator<TaskState<T, R>> {
    let cursor = 0;
    const tasks: Task<T, R>[] = inputs.map((input, i) => ({
      id: `task-${i + 1}`,
      input,
      fn,
      status: 'pending',
      attempts: 0
    }));

    const pool = new Set<Promise<Task<T, R>>>();

    function launchNext(): Promise<Task<T, R>> | null {
      if (cursor >= tasks.length) return null;

      const task = tasks[cursor++];
      task.status = 'running';
      events.emit('taskStart', task);

      const promise: Promise<Task<T, R>> = executeWithRetry(
        task,
        maxRetries,
        baseDelay,
        () => events.emit('taskRetry', task)
      )
        .then((result) => {
          task.status = 'completed';
          task.result = result;
          events.emit('taskSuccess', task);
          return task;
        })
        .catch((err) => {
          task.status = 'failed';
          task.error = isError(err) ? err : new Error(String(err));
          events.emit('taskFailed', task);
          return task;
        })
        .finally(() => {
          pool.delete(promise);
        });

      pool.add(promise);
      return promise;
    }

    while (pool.size < concurrency && cursor < tasks.length) {
      launchNext();
    }

    while (pool.size > 0) {
      const finished = await Promise.race(pool);
      yield finished;
      launchNext();
    }
  }

  return {
    on: events.on,
    run
  };
}

async function main() {
  const pipeline = createPipeline<number, string>({
    concurrency: 2,
    maxRetries: 2,
    baseDelay: 50
  });

  pipeline.on('taskStart', (t) => console.log(`[STARTED] ${t.id} with input ${t.input}`));
  pipeline.on('taskRetry', (t) => console.log(`[RETRY]   ${t.id} (attempt ${t.attempts})`));
  pipeline.on('taskSuccess', (t) => console.log(`[SUCCESS] ${t.id} -> ${t.result}`));
  pipeline.on('taskFailed', (t) => console.log(`[FAILED]  ${t.id} -> ${t.error?.message}`));

  const numbers = [1, 2, 3, 4, 5];

  for await (const result of pipeline.run(numbers, async (n) => {
    if (n === 3 && Math.random() > 0.4) {
      throw new Error('Intermittent API timeout');
    }
    await sleep(80);
    return `Processed: ${n * 10}`;
  })) {
    console.log(`[STREAM]  Yielded ${result.id} (${result.status})`);
  }
}

main();