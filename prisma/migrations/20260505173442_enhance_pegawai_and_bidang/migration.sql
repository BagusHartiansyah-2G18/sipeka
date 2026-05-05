-- CreateTable
CREATE TABLE `Bidang` (
    `id` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Bidang_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `link` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'KEPALA_BADAN', 'SEKRETARIS_BADAN', 'KABAG_UMUM_KEPEGAWAIAN', 'KEPALA_BIDANG', 'PEGAWAI') NOT NULL DEFAULT 'PEGAWAI',
    `pegawaiId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_pegawaiId_key`(`pegawaiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pegawai` (
    `id` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `tempatLahir` VARCHAR(191) NULL,
    `tanggalLahir` DATETIME(3) NULL,
    `jenisKelamin` VARCHAR(191) NULL,
    `agama` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `noTelp` VARCHAR(191) NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `tmtJabatan` DATETIME(3) NULL,
    `bidangId` VARCHAR(191) NULL,
    `pangkat` VARCHAR(191) NULL,
    `golonganRuang` VARCHAR(191) NOT NULL,
    `tmtGolongan` DATETIME(3) NULL,
    `unitKerja` VARCHAR(191) NULL DEFAULT 'Badan Kesatuan Bangsa dan Politik',
    `dinas` VARCHAR(191) NULL DEFAULT 'Kabupaten Sumbawa Barat',
    `masaKerja` VARCHAR(191) NULL,
    `tglMasaKerja` DATETIME(3) NULL,
    `gajiPokok` INTEGER NULL,
    `tmtPangkat` DATETIME(3) NULL,
    `pendidikanAkhir` VARCHAR(191) NULL,
    `statusPegawai` VARCHAR(191) NOT NULL DEFAULT 'AKTIF',
    `fotoUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pegawai_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuti` (
    `id` VARCHAR(191) NOT NULL,
    `pegawaiId` VARCHAR(191) NOT NULL,
    `jenisCuti` ENUM('TAHUNAN', 'SAKIT', 'MELAHIRKAN', 'BESAR', 'ALASAN_PENTING', 'LUAR_TANGGUNGAN_NEGARA') NOT NULL,
    `tanggalMulai` DATETIME(3) NOT NULL,
    `tanggalSelesai` DATETIME(3) NOT NULL,
    `jumlahHari` INTEGER NOT NULL,
    `durasiJenis` VARCHAR(191) NOT NULL DEFAULT 'HARI',
    `alasan` TEXT NOT NULL,
    `alamatSelama` TEXT NULL,
    `sisaCuti` INTEGER NULL,
    `status` ENUM('DRAFT', 'MENUNGGU_ATASAN_1', 'MENUNGGU_ATASAN_2', 'MENUNGGU_ADMIN', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'DRAFT',
    `atasan1Jabatan` VARCHAR(191) NULL,
    `atasan1Nama` VARCHAR(191) NULL,
    `atasan1Nip` VARCHAR(191) NULL,
    `atasan2Jabatan` VARCHAR(191) NULL,
    `atasan2Nama` VARCHAR(191) NULL,
    `atasan2Nip` VARCHAR(191) NULL,
    `filePendukungUrl` VARCHAR(191) NULL,
    `ttdKabirBidang` VARCHAR(191) NULL,
    `ttdKabirStatus` BOOLEAN NOT NULL DEFAULT false,
    `ttdSekretaris` VARCHAR(191) NULL,
    `ttdSekretarisStatus` BOOLEAN NOT NULL DEFAULT false,
    `ttdKepalaBadan` VARCHAR(191) NULL,
    `ttdKepalaBadanStatus` BOOLEAN NOT NULL DEFAULT false,
    `ttdSekda` VARCHAR(191) NULL,
    `ttdSekdaStatus` BOOLEAN NOT NULL DEFAULT false,
    `nomorSurat` VARCHAR(191) NULL,
    `alasanPenolakan` TEXT NULL,
    `catatanAdmin` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KenaikanGajiBerkala` (
    `id` VARCHAR(191) NOT NULL,
    `pegawaiId` VARCHAR(191) NOT NULL,
    `gajiPokokSekarang` INTEGER NOT NULL,
    `tmtGajiSekarang` DATETIME(3) NOT NULL,
    `golonganSekarang` VARCHAR(191) NOT NULL,
    `tmtKGBDiusulkan` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'MENUNGGU_ATASAN_1', 'MENUNGGU_ATASAN_2', 'MENUNGGU_ADMIN', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'DRAFT',
    `nomorSurat` VARCHAR(191) NULL,
    `docSkPangkat` VARCHAR(191) NULL,
    `docSkKGB` VARCHAR(191) NULL,
    `docSKP` VARCHAR(191) NULL,
    `docHukdis` VARCHAR(191) NULL,
    `docDRH` VARCHAR(191) NULL,
    `catatanAdmin` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KenaikanPangkat` (
    `id` VARCHAR(191) NOT NULL,
    `pegawaiId` VARCHAR(191) NOT NULL,
    `jabatanSekarang` VARCHAR(191) NOT NULL,
    `golonganSekarang` VARCHAR(191) NOT NULL,
    `tmtPangkatSekarang` DATETIME(3) NOT NULL,
    `usulPangkatKe` VARCHAR(191) NOT NULL,
    `jenisKenaikanPangkat` ENUM('REGULER', 'PILIHAN', 'ANUMERTA') NOT NULL,
    `status` ENUM('DRAFT', 'MENUNGGU_ATASAN_1', 'MENUNGGU_ATASAN_2', 'MENUNGGU_ADMIN', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'DRAFT',
    `nomorSurat` VARCHAR(191) NULL,
    `docIjazah` VARCHAR(191) NULL,
    `docSKP` VARCHAR(191) NULL,
    `docSkPengangkatan` VARCHAR(191) NULL,
    `docSkPangkat` VARCHAR(191) NULL,
    `docDiklat` VARCHAR(191) NULL,
    `catatanAdmin` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pegawai` ADD CONSTRAINT `Pegawai_bidangId_fkey` FOREIGN KEY (`bidangId`) REFERENCES `Bidang`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cuti` ADD CONSTRAINT `Cuti_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KenaikanGajiBerkala` ADD CONSTRAINT `KenaikanGajiBerkala_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KenaikanPangkat` ADD CONSTRAINT `KenaikanPangkat_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
