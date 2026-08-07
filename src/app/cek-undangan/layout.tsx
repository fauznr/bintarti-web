import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Status Undangan Digital - Bintarti",
  description: "Cek status pembuatan, masa aktif, pin resepsionis, dan kelola tamu undangan digital Anda di Bintarti.",
  keywords: ["cek status undangan", "kelola tamu undangan", "pin resepsionis undangan", "dashboard undangan digital"],
};
import AdminPWARegister from "@/components/AdminPWARegister";

export default function CekUndanganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminPWARegister />
      {children}
    </>
  );
}
