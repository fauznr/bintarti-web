import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Desain Undangan Digital - Bintarti",
  description: "Pilih template undangan digital premium untuk ulang tahun anak, khitan, pernikahan, dan aqiqah dengan desain premium yang interaktif.",
  keywords: ["katalog undangan digital", "template undangan ulang tahun anak", "undangan khitanan digital", "desain undangan digital premium"],
};

export default function KatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
