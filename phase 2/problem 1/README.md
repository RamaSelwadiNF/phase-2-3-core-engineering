# Asynchronous Task Runner & Data Pipeline

A type-safe job processing pipeline built with TypeScript and pure ES6+. Features a custom promise pool, retry handlers with exponential backoff, async generator streaming, and closure-encapsulated event handling.

## Requirements

You need Node.js (v18+) or an alternate runtime (Bun, Deno). No manual compilation step or build config is required.

## How to Run

Run the file directly using any of the following commands:

### Option 1: Node.js (via `tsx` - Recommended)
Runs directly without generating build files:

```bash
npx tsx pipeline.ts