// src/app/api/cuti/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const cutiSchema = z.object({
  pegawaiId: z.string(),
  jenisCuti: z.enum(["TAHUNAN","SAKIT","MELAHIRKAN","BESAR","ALASAN_PENTING","LUAR_TANGGUNGAN_NEGARA"]),
  tanggalMulai: z.string(),
  tanggalSelesai: z.string(),
  jumlahHari: z.number().min(1),
  alasan: z.string().min(5),
  alamatSelama: z.string().optional(),
});

// GET — ambil semua cuti (sesuai level akses)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, pegawaiId, bidang } = session.user as any;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 10;

  let whereClause: any = {};

  if (status) whereClause.status = status;

  // Filter berdasarkan level akses
  if (role === "PEGAWAI") {
    // Pegawai hanya bisa lihat pengajuan sendiri
    whereClause.pegawaiId = pegawaiId;
  } else if (role === "KEPALA_BIDANG") {
    // Kepala Bidang hanya bisa lihat pegawai di bidangnya
    whereClause.pegawai = { bidang };
  } else if (role === "KABAG_UMUM_KEPEGAWAIAN") {
    // Kabag bisa lihat pegawai di bawahnya (kecuali pimpinan)
    whereClause.pegawai = {
      role: { notIn: ["KEPALA_BADAN", "SEKRETARIS_BADAN"] }
    };
  }
  // ADMIN, KEPALA_BADAN, SEKRETARIS_BADAN → bisa lihat semua

  const [data, total] = await Promise.all([
    prisma.cuti.findMany({
      where: whereClause,
      include: { pegawai: { select: { nama: true, jabatan: true, bidang: true, nip: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.cuti.count({ where: whereClause }),
  ]);

  return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / limit) });
}

// POST — buat pengajuan cuti baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = cutiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data } = parsed;
  const pegawai = await prisma.pegawai.findUnique({ where: { id: data.pegawaiId } });
  if (!pegawai) return NextResponse.json({ error: "Pegawai tidak ditemukan" }, { status: 404 });

  // Tentukan tanda tangan otomatis berdasarkan bidang & jabatan
  const userRole = (session.user as any).role;
  let ttdKabirBidang = null;
  let ttdSekretaris = null;
  let ttdKepalaBadan = "Drs. Syarifuddin, M.Si - Kepala Kesbangpol KSB";
  let ttdSekda = null;

  if (userRole === "PEGAWAI") {
    if (pegawai.bidang === "SEKRETARIAT") {
      ttdSekretaris = "Murniati Rahayu, S.IP - Sekretaris Badan";
    } else {
      ttdKabirBidang = `Kepala ${pegawai.bidang}`;
    }
  } else if (userRole === "KEPALA_BIDANG" || userRole === "SEKRETARIS_BADAN") {
    ttdKepalaBadan = "Drs. Syarifuddin, M.Si - Kepala Kesbangpol KSB";
    ttdSekda = "Sekretaris Daerah KSB";
  }

  const cuti = await prisma.cuti.create({
    data: {
      ...data,
      tanggalMulai: new Date(data.tanggalMulai),
      tanggalSelesai: new Date(data.tanggalSelesai),
      status: "MENUNGGU",
      ttdKabirBidang,
      ttdSekretaris,
      ttdKepalaBadan,
      ttdSekda,
    },
  });

  return NextResponse.json(cuti, { status: 201 });
}
