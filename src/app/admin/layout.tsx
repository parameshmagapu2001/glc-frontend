import "./globals.css"; // ✅ admin-only styles

export const metadata = {
  title: "Admin | Green Land Capital",
  description: "Green Land Capital admin dashboard and authentication",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
