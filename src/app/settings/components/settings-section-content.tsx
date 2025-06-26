import React from "react";

export default function SettingsSectionContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-0 pt-0 pb-6 sm:px-2 ${className}`}>{children}</div>
  );
}
