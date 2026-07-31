import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formulir Pembuatan Undangan Digital - Bintarti",
  description: "Isi data acara Anda untuk membuat undangan digital ulang tahun, khitan, pernikahan, dan aqiqah dengan praktis dan instan.",
  keywords: ["buat undangan digital", "form undangan ulang tahun", "form undangan khitanan", "undangan digital instan"],
};

export default function FormulirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
