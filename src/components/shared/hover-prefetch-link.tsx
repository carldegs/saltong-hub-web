"use client";

import Link, { LinkProps } from "next/link";
import { useState } from "react";

export default function HoverPrefetchLink(
  props: LinkProps & { children?: React.ReactNode; className?: string }
) {
  const [active, setActive] = useState(false);

  return (
    <Link
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
      {...props}
    />
  );
}
