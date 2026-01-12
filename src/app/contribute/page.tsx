"use client";

import { Navbar } from "@/components/shared/navbar";
import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

export default function ContributePage() {
  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="dark:from-background dark:via-muted/60 dark:to-muted/80 relative flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] py-0 sm:py-8">
        <Card className="sm:bg-background w-full rounded-none bg-none pb-0 sm:mx-4 sm:max-w-xl sm:rounded-lg">
          <CardHeader className="items-center">
            <CardTitle className="text-center text-3xl font-bold tracking-tight">
              Contribute
            </CardTitle>
          </CardHeader>
          <CardContent className="mb-8 flex flex-col items-center gap-4">
            <div className="space-y-2 text-center">
              <p>
                Hi there! If you enjoyed this app and want to support my work,
                consider contributing a few bucks. Your support helps offset the
                costs of hosting the app. <i>Labyu</i> 😘
              </p>
            </div>

            <Tabs defaultValue="gcash" className="w-full">
              <TabsList className="mt-6 w-full">
                <TabsTrigger value="gcash">GCash/Maya</TabsTrigger>
                <TabsTrigger value="kofi">Paypal/Cards</TabsTrigger>
              </TabsList>
              <TabsContent value="gcash">
                <div className="relative mx-auto aspect-square w-full max-w-[300px]">
                  <Image
                    src="/gcash.jpg"
                    alt="GCash QR Code"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>

                <a
                  download={`balita-of-the-week-gcash.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  href={"/gcash.jpg"}
                  title="Download QR Code"
                  className="grow"
                >
                  <Button variant="default" className="mt-4 w-full bg-blue-500">
                    <DownloadIcon className="mr-2" />
                    Download QR
                  </Button>
                </a>
              </TabsContent>
              <TabsContent value="kofi">
                <iframe
                  id="kofiframe"
                  src="https://ko-fi.com/carldegs/?hidefeed=true&widget=true&embed=true&preview=true"
                  className="padding-1 w-full rounded-lg border-none"
                  style={{
                    background: "#f9f9f9",
                    padding: "1rem",
                  }}
                  height="600"
                  title="carldegs"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
