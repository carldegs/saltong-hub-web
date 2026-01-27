"use client";

import { QRCodeSVG } from "qrcode.react";
import { ComponentProps, useEffect, useState } from "react";

export function SaltongQrCodeSvg({
  imageSize,
  ...props
}: ComponentProps<typeof QRCodeSVG> & { imageSize: number }) {
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadLogo = async () => {
      try {
        const res = await fetch("/hub.svg");
        if (!res.ok) return;
        const svgText = await res.text();
        if (!active) return;
        const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
        setLogoDataUrl(dataUrl);
      } catch (error) {
        console.error("Failed to load hub logo for QR", error);
      }
    };

    loadLogo();

    return () => {
      active = false;
    };
  }, []);

  return (
    <QRCodeSVG
      {...props}
      imageSettings={{
        src: logoDataUrl ?? "/hub.svg",
        height: imageSize ?? 80,
        width: imageSize ?? 80,
        excavate: true,
        ...props.imageSettings,
      }}
    />
  );
}
