import "./globals.css";

export const metadata = {
  title: "Green Land Capital",
  description: "Portal for Green Land Capital Administration",
};

export default function RootLayout({
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
