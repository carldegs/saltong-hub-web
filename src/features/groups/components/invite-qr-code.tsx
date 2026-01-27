"use client";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SaltongQrCodeSvg } from "@/components/shared/saltong-qr-code-svg";
import { DownloadIcon, ShareIcon } from "lucide-react";
import { downloadStyledQrPng, shareQrImage } from "../utils/qr";

export default function InviteQRCode({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Check if share is available on mount
    if (typeof navigator !== "undefined" && !!window?.navigator?.canShare) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanShare(true);
    }
  }, []);

  const handleClickDownload = () => {
    const svg = svgRef.current;
    if (!svg) {
      console.error("SVG ref not available");
      return;
    }
    downloadStyledQrPng(svg, label);
  };

  const handleClickShare = async () => {
    const svg = svgRef.current;
    if (!svg) return;
    try {
      await shareQrImage(svg, label);
    } catch (error) {
      // Ignore AbortError when user cancels share
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  return (
    <Card className="w-full gap-2">
      <CardHeader>
        <CardTitle>Share the QR Code</CardTitle>
      </CardHeader>
      <CardContent className="mx-auto">
        <SaltongQrCodeSvg
          ref={svgRef}
          value={value}
          marginSize={2}
          level="M"
          size={280}
          fgColor="#252827"
          bgColor="#ffffff"
          imageSize={80}
          className="rounded-lg"
        />
      </CardContent>
      <CardFooter className="flex w-full justify-between gap-4">
        {canShare && (
          <Button variant="outline" className="grow" onClick={handleClickShare}>
            <ShareIcon /> Share
          </Button>
        )}
        <Button onClick={handleClickDownload} className="grow">
          <DownloadIcon /> Download
        </Button>
      </CardFooter>
    </Card>
  );
}
