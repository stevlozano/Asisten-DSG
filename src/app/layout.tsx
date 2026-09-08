import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import PanelLayout from "@/components/layout/panel-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
const manrope = Manrope({ subsets:["latin"], variable:"--font-manrope" });
export const metadata: Metadata = { title: "ASISTEN-DSG", description: "DSG PERU TECHNOLOGY SAC" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={manrope.variable} suppressHydrationWarning>
      <body className="antialiased font-sans"><ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}><PanelLayout>{children}</PanelLayout><Toaster richColors position="top-right"/></ThemeProvider></body>
    </html>
  );
}
