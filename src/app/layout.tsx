// app/layout.tsx
import { headers } from "next/headers";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  if (isMobile) {
    return (
      <html lang="en" className={instrumentSans.variable}>
        <body className="antialiased">
          <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold">Mobile Not Supported</h2>
            <p className="mt-4 text-lg text-center">
              We yet do not support mobile devices. Please access our site from
              a desktop browser.
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={instrumentSans.variable}>
      <body className="antialiased">
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
