import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import QueryProvider from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import { ToastProvider } from "@/lib/components/ToastProvider";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shah Sports",
  description: "Premium sports flooring and equipment solutions",
  colorScheme: "light",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${instrumentSans.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster position="bottom-right" richColors />
        <ToastProvider />
      </body>
    </html>
  );
}
