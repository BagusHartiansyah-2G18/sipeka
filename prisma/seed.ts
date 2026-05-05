import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Seed Bidang
  const bidangData = [
    { kode: "SEK", nama: "Sekretariat" },
    { kode: "IDK", nama: "Bidang Ideologi dan Karakter Bangsa" },
    { kode: "KWN", nama: "Bidang Kewaspadaan dan Ketahanan Nasional" },
    { kode: "POL", nama: "Bidang Politik Dalam Negeri dan Ormas" },
  ];

  for (const b of bidangData) {
    await prisma.bidang.upsert({
      where: { kode: b.kode },
      update: b,
      create: b,
    });
  }

  const sek = await prisma.bidang.findUnique({ where: { kode: "SEK" } });
  const idk = await prisma.bidang.findUnique({ where: { kode: "IDK" } });
  const kwn = await prisma.bidang.findUnique({ where: { kode: "KWN" } });
  const pol = await prisma.bidang.findUnique({ where: { kode: "POL" } });

  const pegawaiData = [
    { nip: "196907261993031009", nama: "Saifullah, S.IP", jabatan: "Kepala Badan", bidangId: sek?.id, role: Role.KEPALA_BADAN, pangkat: "Pembina tingkat 1", golonganRuang: "IV/b", tmtGolongan: "2025-07-26", tmtJabatan: null, masaKerja: "32 Tahun 08 Bulan" },
    { nip: "197906122011011010", nama: "M. Arie Kurniawan, S.T., M.M.Inov", jabatan: "Sekretaris Badan", bidangId: sek?.id, role: Role.SEKRETARIS_BADAN, pangkat: "Pembina", golonganRuang: "IV/a", tmtGolongan: "2026-04-01", tmtJabatan: null, masaKerja: "15 Tahun 0 Bulan" },
    { nip: "198009012006042026", nama: "Laela Amrullah, SE, M.M", jabatan: "Kepala Bidang Wastanas", bidangId: kwn?.id, role: Role.KEPALA_BIDANG, pangkat: "IV/b", golonganRuang: "IV/b", tmtGolongan: "2023-10-01", tmtJabatan: "2025-10-02", masaKerja: "19 Tahun 05 Bulan" },
    { nip: "196907191993031005", nama: "Abdul Munir, S.Pd. SD", jabatan: "Kepala Bidang Idiologi & Karakter Bangsa", bidangId: idk?.id, role: Role.KEPALA_BIDANG, pangkat: "IV/a", golonganRuang: "IV/a", tmtGolongan: "2021-04-01", tmtJabatan: "2025-10-02", masaKerja: "32 Tahun 08 Bulan" },
    { nip: "197006272002121005", nama: "Farhan, S.Pi", jabatan: "Kepala Bidang Poldagri & Ormas", bidangId: pol?.id, role: Role.KEPALA_BIDANG, pangkat: "IV/a", golonganRuang: "IV/a", tmtGolongan: "2025-04-01", tmtJabatan: "2025-10-02", masaKerja: "22 Tahun 11 Bulan" },
    { nip: "197208052014102002", nama: "Hj. Mulaini, SP", jabatan: "Kasubbag Umkep", bidangId: sek?.id, role: Role.KABAG_UMUM_KEPEGAWAIAN, pangkat: "III/d", golonganRuang: "III/d", tmtGolongan: "2025-04-01", tmtJabatan: "2025-10-02", masaKerja: "20 Tahun 11 Bulan" },
    { nip: "197605252010012015", nama: "Henny Sasmitha, S.T., M.M.Inov", jabatan: "Analis Kebijakan Ahli Muda", bidangId: kwn?.id, role: Role.PEGAWAI, pangkat: "III/d", golonganRuang: "III/d", tmtGolongan: "2022-04-02", tmtJabatan: "2018-04-02", masaKerja: "12 Tahun 04 Bulan" },
    { nip: "198207262011011009", nama: "M. Husni Thamrin, S.IP, M.M.Inov", jabatan: "Analis Kebijakan Ahli Muda", bidangId: pol?.id, role: Role.PEGAWAI, pangkat: "III/c", golonganRuang: "III/c", tmtGolongan: "2023-04-01", tmtJabatan: "2023-04-01", masaKerja: "13 Tahun 03 Bulan" },
    { nip: "198606232006021001", nama: "Satriawan, S.STP., M.M.Inov", jabatan: "Analis Kebijakan Ahli Muda", bidangId: idk?.id, role: Role.PEGAWAI, pangkat: "III/d", golonganRuang: "III/d", tmtGolongan: "2016-10-01", tmtJabatan: "2022-04-08", masaKerja: "07 Tahun 05 Bulan" },
    { nip: "198305162010012009", nama: "Nurjannah Juliarti, S.AP", jabatan: "Analis Kebijakan Ahli Muda", bidangId: pol?.id, role: Role.PEGAWAI, pangkat: "III/d", golonganRuang: "III/d", tmtGolongan: "2022-04-01", tmtJabatan: "2018-04-01", masaKerja: "12 Tahun 03 Bulan" },
    { nip: "198009112007011008", nama: "Hairuddin, SH", jabatan: "Analis Kebijakan Ahli Muda", bidangId: kwn?.id, role: Role.PEGAWAI, pangkat: "III/c", golonganRuang: "III/c", tmtGolongan: "2021-04-01", tmtJabatan: "2022-04-08", masaKerja: "14 Tahun 06 Bulan" },
    { nip: "197510282007011015", nama: "Windra Kurnia, SE", jabatan: "Penelaah Teknis Kebijakan", bidangId: pol?.id, role: Role.PEGAWAI, pangkat: "III/c", golonganRuang: "III/c", tmtGolongan: "2025-06-01", tmtJabatan: "2025-06-01", masaKerja: "18 Tahun 10 Bulan" },
    { nip: "198104282008011016", nama: "Aan Hidayat, S.AP", jabatan: "Staf", bidangId: pol?.id, role: Role.PEGAWAI, pangkat: "III/b", golonganRuang: "III/b", tmtGolongan: "2016-10-01", tmtJabatan: "2016-10-10", masaKerja: "17 Tahun 09 Bulan" },
    { nip: "198403252014102003", nama: "Eka Martina Anpusyahnur, SE", jabatan: "Bendahara Pengeluaran", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "III/a", golonganRuang: "III/a", tmtGolongan: "2024-06-01", tmtJabatan: "2024-06-01", masaKerja: "10 Tahun 3 Bulan" },
    { nip: "196902011989011001", nama: "Samsi", jabatan: "Staf", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "III/a", golonganRuang: "III/a", tmtGolongan: "2019-04-01", tmtJabatan: "2023-04-01", masaKerja: "23 Tahun 10 Bulan" },
    { nip: "197101102006041022", nama: "Karyadi", jabatan: "Staf", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "III/a", golonganRuang: "III/a", tmtGolongan: "2022-04-01", tmtJabatan: "2022-04-01", masaKerja: "12 Tahun 08 Bulan" },
    { nip: "197201152007011025", nama: "Ahmad", jabatan: "Staf", bidangId: idk?.id, role: Role.PEGAWAI, pangkat: "II/d", golonganRuang: "II/d", tmtGolongan: "2019-04-01", tmtJabatan: "2024-04-01", masaKerja: "14 Tahun 08 Bulan" },
    { nip: "198104152008011018", nama: "Sofyan", jabatan: "Staf", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "II/d", golonganRuang: "II/d", tmtGolongan: "2022-10-01", tmtJabatan: "2022-10-01", masaKerja: "17 Tahun 09 Bulan" },
    { nip: "198306092010011012", nama: "Adi Jayadi", jabatan: "Staf", bidangId: idk?.id, role: Role.PEGAWAI, pangkat: "II/c", golonganRuang: "II/c", tmtGolongan: "2018-04-01", tmtJabatan: "2018-04-01", masaKerja: "13 Tahun 03 Bulan" },
    { nip: "198511052023211015", nama: "Ovi Putra Pandinata, SE", jabatan: "Staf Perencana", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2023-11-01", tmtJabatan: "2023-11-01", masaKerja: "02 Tahun 1 Bln" },
    { nip: "198504112023212030", nama: "Mimin Armila, SE.", jabatan: "Staf Arsiparis", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2023-11-01", tmtJabatan: "2023-11-01", masaKerja: "02 Tahun 1 Bln" },
    { nip: "199205012023212055", nama: "Wulan Armianti, S.Kom", jabatan: "Staf", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2023-11-01", tmtJabatan: "2023-11-01", masaKerja: "02 Tahun 1 Bln" },
    { nip: "197303052024211001", nama: "Busran, S.IP", jabatan: "Staf Arsiparis", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2024-03-01", tmtJabatan: "2024-03-01", masaKerja: "01 Tahun 9 Bulan" },
    { nip: "198307032024212001", nama: "Dian Armini, SKM", jabatan: "Staf Perencana", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2024-03-01", tmtJabatan: "2024-03-01", masaKerja: "01 Tahun 9 Bulan" },
    { nip: "198206192025211029", nama: "Istanto, S.E", jabatan: "Staf", bidangId: kwn?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198711252025211024", nama: "Roni Noval Putra Arta, S.Adm", jabatan: "Staf", bidangId: pol?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198709242025211022", nama: "Arifuddin, S.Pd.", jabatan: "Staf", bidangId: kwn?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198808282025211026", nama: "Egit Irman Fadeta, S.Pd.", jabatan: "Staf", bidangId: kwn?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198102022025211033", nama: "Ahmad, S.AP", jabatan: "Staf", bidangId: pol?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198712012025212028", nama: "Bilhusnah, S.Pd", jabatan: "Staf", bidangId: kwn?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198812082025212031", nama: "Denjisana, S.Pd", jabatan: "Staf", bidangId: idk?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198607022025211016", nama: "Ardiansyah, ST", jabatan: "Staf", bidangId: pol?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "199606222025212020", nama: "Yeyen Armiati, S.P", jabatan: "Staf", bidangId: kwn?.id, role: Role.PEGAWAI, pangkat: "IX", golonganRuang: "IX", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198506232025212016", nama: "Hazizah, A.Md", jabatan: "Staf", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "VII", golonganRuang: "VII", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "200007112025211003", nama: "Salam Juliansyah Al Gafari", jabatan: "Staf", bidangId: pol?.id, role: Role.PEGAWAI, pangkat: "V", golonganRuang: "V", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "197811102025211025", nama: "Hasanuddin", jabatan: "Staf", bidangId: pol?.id, role: Role.PEGAWAI, pangkat: "V", golonganRuang: "V", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198203102025211007", nama: "Syahrul Bahri", jabatan: "Staf", bidangId: idk?.id, role: Role.PEGAWAI, pangkat: "V", golonganRuang: "V", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "197608252025211007", nama: "Paimin", jabatan: "Staf", bidangId: idk?.id, role: Role.PEGAWAI, pangkat: "V", golonganRuang: "V", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198804182025212021", nama: "Nurul Ramdani", jabatan: "Staf", bidangId: pol?.id, role: Role.PEGAWAI, pangkat: "V", golonganRuang: "V", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198701052025212018", nama: "Rosida", jabatan: "Staf", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "V", golonganRuang: "V", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "198110012025211013", nama: "Hattamuddin", jabatan: "Staf", bidangId: idk?.id, role: Role.PEGAWAI, pangkat: "V", golonganRuang: "V", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "199801032025212001", nama: "Yeni Utamin", jabatan: "Staf", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "V", golonganRuang: "V", tmtGolongan: "2025-08-01", tmtJabatan: "2025-08-01", masaKerja: "00 Tahun 04 Bulan" },
    { nip: "197910302025212019", nama: "Nurwahida", jabatan: "Staf", bidangId: sek?.id, role: Role.PEGAWAI, pangkat: "V", golonganRuang: "V", tmtGolongan: "2025-10-01", tmtJabatan: "2025-10-01", masaKerja: "00 Tahun 02 Bulan" },
  ];

  for (const p of pegawaiData) {
    const { role, ...pData } = p;
    await prisma.pegawai.upsert({
      where: { nip: p.nip },
      update: {
        ...pData,
        tmtGolongan: p.tmtGolongan ? new Date(p.tmtGolongan) : null,
        tmtJabatan: p.tmtJabatan ? new Date(p.tmtJabatan) : null,
      },
      create: {
        ...pData,
        tmtGolongan: p.tmtGolongan ? new Date(p.tmtGolongan) : null,
        tmtJabatan: p.tmtJabatan ? new Date(p.tmtJabatan) : null,
        user: {
          create: {
            email: `${p.nip}@sipeka.com`,
            password: passwordHash,
            role: role,
          },
        },
      },
    });
  }

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
