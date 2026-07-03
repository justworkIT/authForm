import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuthForm",
  description: "Reusable signup/login module powered by Supabase Auth",
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
