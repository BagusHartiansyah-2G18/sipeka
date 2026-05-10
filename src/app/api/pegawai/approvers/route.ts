// src/app/api/pegawai/approvers/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { role, bidang } = session.user;

  try {
    // 1. Get Atasan 2 (Kepala Badan) - Always fixed for now as requested
    const kepalaBadan = await prisma.pegawai.findFirst({
      where: {
        user: { role: "KEPALA_BADAN" }
      },
      select: { nama: true, nip: true, jabatan: true }
    });

    // 2. Get Atasan 1 based on hierarchy
    let atasan1 = null;

    if (bidang === "SEK") {
      if (role === "KABAG_UMUM_KEPEGAWAIAN") {
        // Kabag reports to Sekretaris Badan
        atasan1 = await prisma.pegawai.findFirst({
          where: { user: { role: "SEKRETARIS_BADAN" } },
          select: { nama: true, nip: true, jabatan: true }
        });
      } else {
        // Other Sekretariat staff report to Kasubbag Umkep (KABAG_UMUM_KEPEGAWAIAN)
        atasan1 = await prisma.pegawai.findFirst({
          where: { user: { role: "KABAG_UMUM_KEPEGAWAIAN" } },
          select: { nama: true, nip: true, jabatan: true }
        });
      }
    } else if (bidang) {
      // For other divisions, Atasan 1 is the Kepala Bidang of that division
      atasan1 = await prisma.pegawai.findFirst({
        where: {
          bidang: { kode: bidang },
          user: { role: "KEPALA_BIDANG" }
        },
        select: { nama: true, nip: true, jabatan: true }
      });
    }

    return NextResponse.json({
      atasan1: atasan1 || { nama: "", nip: "", jabatan: "" },
      atasan2: kepalaBadan || { nama: "", nip: "", jabatan: "" }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
