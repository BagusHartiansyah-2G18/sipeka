import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

// GET — ambil semua cuti (sesuai level akses)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, nip, bidang } = session.user;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 10;

  let whereClause: any = {};

  if (status) whereClause.status = status;

  // Filter berdasarkan level akses
  if (role === "PEGAWAI") {
    whereClause.pegawai = { nip };
  } else if (role === "KEPALA_BIDANG") {
    whereClause.pegawai = { bidang };
  } else if (role === "KABAG_UMUM_KEPEGAWAIAN") {
    whereClause.pegawai = {
      role: { notIn: ["KEPALA_BADAN", "SEKRETARIS_BADAN"] }
    };
  }

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

// POST — buat pengajuan cuti baru (Multipart Form Data)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    
    // Extract fields
    const jenisCuti = formData.get("jenisCuti") as string;
    const alasan = formData.get("alasan") as string;
    const tanggalMulai = formData.get("tanggalMulai") as string;
    const tanggalSelesai = formData.get("tanggalSelesai") as string;
    const jumlahHari = parseInt(formData.get("jumlahHari") as string);
    const durasiJenis = formData.get("durasiJenis") as string;
    const alamatSelama = formData.get("alamatSelama") as string;
    
    const atasan1Jabatan = formData.get("atasan1Jabatan") as string;
    const atasan1Nama = formData.get("atasan1Nama") as string;
    const atasan1Nip = formData.get("atasan1Nip") as string;
    
    const atasan2Jabatan = formData.get("atasan2Jabatan") as string;
    const atasan2Nama = formData.get("atasan2Nama") as string;
    const atasan2Nip = formData.get("atasan2Nip") as string;

    const file = formData.get("file") as File | null;
    let fileUrl = null;

    // Handle File Upload
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Validate file type
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json({ error: "Format file harus PDF, JPG, atau PNG" }, { status: 400 });
      }

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const path = join(process.cwd(), "public/uploads/cuti", fileName);
      
      await writeFile(path, buffer);
      fileUrl = `/uploads/cuti/${fileName}`;
    }

    // Get current pegawai info
    const pegawai = await prisma.pegawai.findUnique({ 
      where: { nip: session.user.nip } 
    });

    if (!pegawai) return NextResponse.json({ error: "Pegawai tidak ditemukan" }, { status: 404 });

    // Create Cuti record
    const cuti = await prisma.cuti.create({
      data: {
        pegawaiId: pegawai.id,
        jenisCuti: jenisCuti as any,
        alasan,
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        jumlahHari,
        durasiJenis: durasiJenis as any,
        alamatSelama,
        atasan1Jabatan,
        atasan1Nama,
        atasan1Nip,
        atasan2Jabatan,
        atasan2Nama,
        atasan2Nip,
        filePendukungUrl: fileUrl,
        status: "MENUNGGU_ATASAN_1",
      },
    });

    return NextResponse.json(cuti, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
