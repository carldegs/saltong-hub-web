"use client";

import { ReactNode } from "react";

import { Button } from "../ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "../ui/credenza";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DownloadIcon } from "lucide-react";

export default function ContributeDialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (_change: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <Credenza open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      {children && <CredenzaTrigger asChild>{children}</CredenzaTrigger>}
      <CredenzaContent>
        <CredenzaHeader className="px-0">
          <CredenzaTitle>Contribute</CredenzaTitle>
          <CredenzaDescription>
            Hi there! If you enjoyed this app and want to support my work,
            consider contributing a few bucks. Your support helps offset the
            costs of hosting the app. <i>Labyu</i> 😘
          </CredenzaDescription>
        </CredenzaHeader>

        <Tabs defaultValue="gcash" className="w-full">
          <TabsList className="mt-6 w-full">
            <TabsTrigger value="gcash">GCash/Maya</TabsTrigger>
            <TabsTrigger value="kofi">Paypal/Cards</TabsTrigger>
          </TabsList>
          <TabsContent value="gcash">
            <div className="aspect-w-1 aspect-h-1 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gcash.jpg"
                alt="GCash QR Code"
                className="mx-auto rounded-lg object-cover"
              />
            </div>

            <a
              download={`balita-of-the-week-gcash.jpg`}
              target="_blank"
              rel="noreferrer"
              href={"/gcash.jpg"}
              title="Download QR Code"
              className="flex-grow"
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
      </CredenzaContent>
    </Credenza>
  );
}
