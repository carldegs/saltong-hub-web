import ModalStoreProvider from "@/providers/modal/modal-provider";
import React from "react";
import { Mansalva as FontHandwriting } from "next/font/google";

const fontHandwriting = FontHandwriting({
  subsets: ["latin"],
  variable: "--font-handwriting",
  weight: "400",
  style: "normal",
});

export default function SudokuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={fontHandwriting.variable}>
      <ModalStoreProvider>{children}</ModalStoreProvider>
    </div>
  );
}
