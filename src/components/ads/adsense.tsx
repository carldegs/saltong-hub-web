import Script from "next/script";

/**
 * GoogleAdSense Component
 *
 * This component only loads the AdSense script - it does NOT enable Auto Ads.
 * Ad units must be manually placed on content-rich pages only (patch notes, policies, etc).
 * Game pages, auth pages, settings, and error pages should NOT display ads.
 *
 * To use: Import AdUnit component and manually place it on qualifying pages.
 * See: src/components/ads/ad-unit.tsx
 */
function GoogleAdSense() {
  return (
    <Script
      id="adsense"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}

export default GoogleAdSense;
