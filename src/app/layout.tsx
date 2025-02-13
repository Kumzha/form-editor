import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import { ReduxProvider } from "@/store/reduxProvider";
import { Toaster } from "@/components/ui/sonner";
import { Instrument_Sans } from "next/font/google";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});
export const metadata: Metadata = {
  title: "Grants Editor",
  description: "Write Grants More Efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body className={`antialiased`}>
        <ReduxProvider>
          <ReactQueryProvider>
            {children}
            <Toaster />
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
