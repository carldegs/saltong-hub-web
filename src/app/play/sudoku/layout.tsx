import ModalStoreProvider from "@/providers/modal/modal-provider";
import React from "react";

export default function SudokuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModalStoreProvider>{children}</ModalStoreProvider>;
}
