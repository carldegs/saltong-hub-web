import React from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { cookies } from "next/headers";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
import { VercelToolbar } from "@vercel/toolbar/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ReactQueryClientProvider } from "@/components/providers/react-query-client-providers";
import GoogleAdSense from "@/components/ads/adsense";
import { ConsentManager } from "./consent-manager";

const APP_NAME = "Saltong Hub";
const APP_TITLE_TEMPLATE = "%s | Saltong Hub";
const APP_DESCRIPTION = "The place for Filipino word games";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Saltong Hub",
    title: {
      default: APP_NAME,
      template: APP_TITLE_TEMPLATE,
    },
    url: "https://saltong.com",
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#252827",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldInjectToolbar = process.env.NODE_ENV === "development";

  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar:state")?.value;
  const defaultOpen =
    sidebarState === undefined ? true : sidebarState === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics gaId="G-Q2M6YCF07C" />
      <GoogleAdSense />

      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <ConsentManager>
          <ReactQueryClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <main className="flex min-h-dvh w-full flex-col">
                  {children}
                </main>
              </SidebarProvider>
              <Toaster richColors />
            </ThemeProvider>
            {shouldInjectToolbar && <VercelToolbar />}
          </ReactQueryClientProvider>
        </ConsentManager>
      </body>
    </html>
  );
}
