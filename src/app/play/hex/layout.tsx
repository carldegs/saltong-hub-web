import ModalStoreProvider from "@/providers/modal/modal-provider";
import React from "react";

export default function SaltongLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModalStoreProvider>{children}</ModalStoreProvider>;
}
