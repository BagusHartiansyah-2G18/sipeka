"use client";

import { useState } from "react";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Edit, 
  Eye, 
  Shield,
  X,
  Check,
  AlertCircle
} from "lucide-react";

interface CutiListProps {
  data: any[];
  isAdmin: boolean;
}

export function CutiList({ data: initialData, isAdmin }: CutiListProps) {
  const [data, setData] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Menunggu": return <Clock size={16} />;
      case "Disetujui": return <CheckCircle size={16} />;
      case "Ditolak": return <XCircle size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Disetujui": return "bg-green-100 text-green-700 border-green-200";
      case "Ditolak": return "bg-red-100 text-red-700 border-red-200";
      default: return "";
    }
  };

  const handleUpdateStatus = (id: number, newStatus: string, reason?: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus, alasanPenolakan: reason } : item
    ));
    setShowStatusModal(false);
    setPendingStatus(null);
    setRejectionReason("");
    alert(`Status pengajuan berhasil diubah menjadi: ${newStatus}`);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* ... table remains same ... */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {isAdmin && (
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Pegawai
                  </th>
                )}
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Jenis Cuti
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Durasi
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{item.pegawai}</span>
                        <span className="text-xs text-gray-500">{item.nip}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {item.jenisCuti}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {item.tanggalMulai} - {item.tanggalSelesai}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center font-medium">
                    {item.jumlahHari} hari
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button 
                        onClick={() => { setSelectedItem(item); setShowDetailModal(true); }}
                        className="flex flex-col items-center group gap-1"
                      >
                        <div className="p-2 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-lg transition-all">
                          <Eye size={18} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 group-hover:text-blue-600">Detail</span>
                      </button>
                      
                      {isAdmin && (
                        <button 
                          onClick={() => { setSelectedItem(item); setShowStatusModal(true); }}
                          className="flex flex-col items-center group gap-1"
                        >
                          <div className="p-2 text-gray-400 group-hover:text-amber-600 group-hover:bg-amber-50 rounded-lg transition-all">
                            <Shield size={18} />
                          </div>
                          <span className="text-[10px] font-medium text-gray-400 group-hover:text-amber-600">Status</span>
                        </button>
                      )}

                      {!isAdmin && item.status === "Menunggu" && (
                        <button className="flex flex-col items-center group gap-1">
                          <div className="p-2 text-gray-400 group-hover:text-green-600 group-hover:bg-green-50 rounded-lg transition-all">
                            <Edit size={18} />
                          </div>
                          <span className="text-[10px] font-medium text-gray-400 group-hover:text-green-600">Ubah</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900">Detail Pengajuan Cuti</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Nama Pegawai</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedItem.pegawai}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">NIP</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedItem.nip}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Jenis Cuti</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedItem.jenisCuti}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${getStatusColor(selectedItem.status)}`}>
                    {getStatusIcon(selectedItem.status)}
                    {selectedItem.status}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Periode Cuti</p>
                <p className="text-sm text-gray-900 font-medium">{selectedItem.tanggalMulai} s/d {selectedItem.tanggalSelesai} ({selectedItem.jumlahHari} hari)</p>
              </div>
              
              {/* Alasan Penolakan Alert */}
              {selectedItem.status === "Ditolak" && selectedItem.alasanPenolakan && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-start animate-fadeIn">
                  <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-900">Alasan Penolakan:</p>
                    <p className="text-sm text-red-700 mt-1 italic">"{selectedItem.alasanPenolakan}"</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Alasan Pengajuan</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1 italic">"Ingin menghadiri acara keluarga di luar kota"</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-right">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal (Admin Only) */}
      {showStatusModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-amber-50">
              <h3 className="font-bold text-amber-900 flex items-center gap-2">
                <Shield size={18} />
                Ubah Status Pengajuan
              </h3>
              <button 
                onClick={() => { setShowStatusModal(false); setPendingStatus(null); setRejectionReason(""); }} 
                className="p-2 hover:bg-amber-100 rounded-full transition-colors text-amber-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {!pendingStatus ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Pilih status terbaru untuk pengajuan <strong>{selectedItem.jenisCuti}</strong> oleh <strong>{selectedItem.pegawai}</strong>.
                  </p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleUpdateStatus(selectedItem.id, "Disetujui")}
                      className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 border border-green-100 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Check size={20} />
                        </div>
                        <span className="font-bold text-green-700">Setujui</span>
                      </div>
                      <ChevronRight size={18} className="text-green-300" />
                    </button>
                    <button 
                      onClick={() => setPendingStatus("Ditolak")}
                      className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <X size={20} />
                        </div>
                        <span className="font-bold text-red-700">Tolak</span>
                      </div>
                      <ChevronRight size={18} className="text-red-300" />
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedItem.id, "Menunggu")}
                      className="w-full flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Clock size={20} />
                        </div>
                        <span className="font-bold text-yellow-700">Menunggu</span>
                      </div>
                      <ChevronRight size={18} className="text-yellow-300" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="animate-fadeIn">
                  <p className="text-sm font-bold text-gray-900 mb-2">Alasan Penolakan</p>
                  <p className="text-xs text-gray-500 mb-3">Berikan keterangan kenapa pengajuan ini ditolak agar pegawai dapat memperbaikinya.</p>
                  <textarea 
                    autoFocus
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
                    rows={4}
                    placeholder="Contoh: Dokumen pendukung kurang lengkap / Tanggal bentrok dengan kegiatan dinas..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => setPendingStatus(null)}
                      className="flex-1 px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Kembali
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedItem.id, "Ditolak", rejectionReason)}
                      disabled={!rejectionReason.trim()}
                      className="flex-1 px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Konfirmasi Tolak
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
              {!pendingStatus && (
                <button onClick={() => setShowStatusModal(false)} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Batal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Simple helper icon
function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
