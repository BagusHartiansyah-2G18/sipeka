import { PrismaClient, Bidang, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clear existing data (optional, but good for consistent demo)
  // Warning: This will delete existing users and pegawai
  // await prisma.user.deleteMany();
  // await prisma.pegawai.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);

  // 1. Seed Kepala Badan
  const kabanData = {
    nip: "197805122008121001",
    nama: "Dr. H. Ahmad Yani, M.Si",
    jabatan: "Kepala Badan",
    bidang: Bidang.SEKRETARIAT,
    pangkat: "Pembina Utama Muda",
    golonganRuang: "IV/c",
    tmtGolongan: new Date("2020-04-01"),
    unitKerja: "Sekretariat",
    dinas: "Badan Kesatuan Bangsa dan Politik",
    masaKerja: "22 Tahun",
    tglMasaKerja: new Date("2002-12-01"),
  };

  const kaban = await prisma.pegawai.upsert({
    where: { nip: kabanData.nip },
    update: kabanData,
    create: {
      ...kabanData,
      user: {
        create: {
          email: "kaban@sipeka.go.id",
          password: passwordHash,
          role: Role.KEPALA_BADAN,
        },
      },
    },
  });

  // 2. Seed Kabag Umum
  const kabagData = {
    nip: "198203102010121002",
    nama: "H. Muhammad Zaini, S.T",
    jabatan: "Kabag Umum & Kepegawaian",
    bidang: Bidang.SEKRETARIAT,
    pangkat: "Penata Tk. I",
    golonganRuang: "III/d",
    tmtGolongan: new Date("2021-04-01"),
    unitKerja: "Sekretariat",
    dinas: "Badan Kesatuan Bangsa dan Politik",
    masaKerja: "14 Tahun",
    tglMasaKerja: new Date("2010-12-01"),
  };

  const kabag = await prisma.pegawai.upsert({
    where: { nip: kabagData.nip },
    update: kabagData,
    create: {
      ...kabagData,
      user: {
        create: {
          email: "kabag@sipeka.go.id",
          password: passwordHash,
          role: Role.KABAG_UMUM_KEPEGAWAIAN,
        },
      },
    },
  });

  // 3. Seed Pegawai Staff
  const staffData = {
    nip: "199001152015122004",
    nama: "Budi Setiawan, S.Kom",
    jabatan: "Analis Sistem Informasi",
    bidang: Bidang.IDEOLOGI_WAWASAN_KARAKTER,
    pangkat: "Penata Muda Tk. I",
    golonganRuang: "III/b",
    tmtGolongan: new Date("2021-10-01"),
    unitKerja: "Bidang Ideologi",
    dinas: "Badan Kesatuan Bangsa dan Politik",
    masaKerja: "8 Tahun",
    tglMasaKerja: new Date("2015-12-01"),
  };

  const staff = await prisma.pegawai.upsert({
    where: { nip: staffData.nip },
    update: staffData,
    create: {
      ...staffData,
      user: {
        create: {
          email: "staff@sipeka.go.id",
          password: passwordHash,
          role: Role.PEGAWAI,
        },
      },
    },
  });

  console.log({ kaban, kabag, staff });
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
