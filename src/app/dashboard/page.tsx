import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { 
  CalendarDays, 
  TrendingUp, 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  UserCheck
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const nama = session?.user?.nama;
  const userPegawaiId = session?.user?.pegawaiId;

  const isManagement = role === "KEPALA_BADAN" || role === "KABAG_UMUM_KEPEGAWAIAN" || role === "ADMIN" || role === "SEKRETARIS_BADAN";

  // Fetch Stats
  const totalPegawai = await prisma.pegawai.count();
  const pendingCuti = await prisma.cuti.count({
    where: { status: { in: ["MENUNGGU_ATASAN_1", "MENUNGGU_ATASAN_2", "MENUNGGU_ADMIN"] } }
  });
  const totalCutiMingguIni = await prisma.cuti.count({
    where: { 
      createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } 
    }
  });
  const pendingKGB = await prisma.kenaikanGajiBerkala.count({
    where: { status: { not: "DISETUJUI" } }
  });

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Selamat datang kembali, <span className="font-semibold text-indigo-600">{nama}</span>! 
            {isManagement ? " Berikut adalah ringkasan operasional kepegawaian." : " Berikut adalah ringkasan aktivitas Anda."}
          </p>
        </div>

        {/* Stats Cards - Dynamic based on role */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isManagement ? (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Persetujuan Pending</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{pendingCuti}</p>
                    <p className="text-gray-400 text-xs mt-1">Perlu tindakan segera</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <UserCheck size={24} className="text-orange-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Pegawai</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">{totalPegawai}</p>
                    <p className="text-green-600 text-xs font-bold mt-1">Aktif</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Pengajuan Cuti</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{totalCutiMingguIni}</p>
                    <p className="text-gray-400 text-xs mt-1">Minggu ini</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <CalendarDays size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Usulan KGB</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{pendingKGB}</p>
                    <p className="text-gray-400 text-xs mt-1">Total pending</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Simplified for employees */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Sisa Cuti</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
                    <p className="text-gray-400 text-xs mt-1">Hari (Tahunan)</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <CalendarDays size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Aktivitas Terkini</h2>
            <div className="text-center py-10">
              <Clock className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-gray-500">Belum ada aktivitas terbaru hari ini.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
            <div className="space-y-3">
              <Link href="/dashboard/cuti/baru" className="flex items-center justify-between p-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors text-indigo-700 font-semibold text-sm">
                <span>Buat Pengajuan Cuti</span>
                <span>→</span>
              </Link>
              {isManagement && (
                <Link href="/dashboard/pegawai" className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-blue-700 font-semibold text-sm">
                  <span>Kelola Pegawai</span>
                  <span>→</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="font-bold text-2xl mb-2 flex items-center gap-2">
              <AlertCircle size={24} />
              Informasi Sistem
            </h3>
            <p className="text-indigo-100 text-lg">
              {isManagement 
                ? `Terdapat ${pendingCuti} pengajuan yang memerlukan persetujuan Anda hari ini.`
                : `Sisa jatah cuti tahunan Anda adalah 12 hari.`
              }
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
