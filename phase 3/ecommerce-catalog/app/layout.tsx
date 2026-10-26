import "./globals.css"

export const metadata = {
  title: "Shop Catalog",
  description: "E-Commerce catalog with complex filters",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}