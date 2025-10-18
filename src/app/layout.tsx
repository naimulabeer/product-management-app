import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/global/Navbar";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // pick what you need
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BitechX · Product Management",
  description: "Browse, create, edit, and manage products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} bg-mist text-ink`}>
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
