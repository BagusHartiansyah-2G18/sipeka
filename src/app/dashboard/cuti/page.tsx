import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Plus, Calendar, CheckCircle, Clock, XCircle, Edit, Eye, Shield } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CutiList } from "./components/CutiList";

export default async function CutiPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role;

  // Admin roles that can edit status
  const isAdmin = role === "KEPALA_BADAN" || role === "SEKRETARIS_BADAN" || role === "ADMIN";

  // Mock data - in real app, fetch from database based on role
  const allPengajuan = [
    {
      id: 1,
      pegawai: "Budi Setiawan",
      nip: "199001152015122004",
      jenisCuti: "Cuti Tahunan",
      tanggalMulai: "2024-06-01",
      tanggalSelesai: "2024-06-15",
      jumlahHari: 15,
      status: "Menunggu",
      statusColor: "yellow",
    },
    {
      id: 2,
      pegawai: "Siti Aminah",
      nip: "199203102018122005",
      jenisCuti: "Cuti Sakit",
      tanggalMulai: "2024-05-20",
      tanggalSelesai: "2024-05-22",
      jumlahHari: 3,
      status: "Disetujui",
      statusColor: "green",
    },
    {
      id: 3,
      pegawai: "Ahmad Yani",
      nip: "198505122010121001",
      jenisCuti: "Cuti Alasan Penting",
      tanggalMulai: "2024-05-10",
      tanggalSelesai: "2024-05-10",
      jumlahHari: 1,
      status: "Ditolak",
      statusColor: "red",
    },
  ];

  // Filter: If not admin, only show own data (mocking this by showing only one if not admin)
  const displayData = isAdmin ? allPengajuan : allPengajuan.filter(p => p.nip === user?.nip || p.pegawai === user?.nama);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Menunggu": return <Clock size={16} />;
      case "Disetujui": return <CheckCircle size={16} />;
      case "Ditolak": return <XCircle size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (color: string) => {
    const colors = {
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
      green: "bg-green-100 text-green-700 border-green-200",
      red: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[color as keyof typeof colors] || "";
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? "Manajemen Pengajuan Cuti" : "Pengajuan Cuti Saya"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAdmin 
                ? "Daftar seluruh pengajuan cuti pegawai yang memerlukan tinjauan." 
                : "Kelola dan pantau status pengajuan cuti Anda."}
            </p>
          </div>
          <Link 
            href="/dashboard/cuti/baru"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95 self-start"
          >
            <Plus size={20} />
            Buat Pengajuan Baru
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">Total Pengajuan</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{displayData.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">
              {isAdmin ? "Menunggu Persetujuan" : "Sisa Cuti Tahunan"}
            </p>
            <p className={`text-2xl font-bold mt-1 ${isAdmin ? "text-yellow-600" : "text-blue-600"}`}>
              {isAdmin ? displayData.filter(p => p.status === "Menunggu").length : "12 hari"}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">Disetujui Bulan Ini</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {displayData.filter(p => p.status === "Disetujui").length}
            </p>
          </div>
        </div>

        {/* Table Content */}
        <CutiList data={displayData} isAdmin={isAdmin} />

        {/* Empty State */}
        {displayData.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">Tidak Ada Data</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
              {isAdmin 
                ? "Saat ini tidak ada pengajuan cuti dari pegawai." 
                : "Anda belum memiliki riwayat pengajuan cuti."}
            </p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
