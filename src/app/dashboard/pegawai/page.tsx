"use client";

import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Search, Filter, Download, Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function PegawaiPage() {
  const [pegawaiList, setPegawaiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, aktif: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPegawai(search, page);
  }, [page]);

  const fetchPegawai = async (searchQuery = "", pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pegawai?search=${searchQuery}&page=${pageNum}`);
      const result = await res.json();
      setPegawaiList(result.data || []);
      setTotalPages(result.totalPages || 1);
      setStats({
        total: result.total || 0,
        aktif: result.data?.filter((p: any) => p.statusPegawai === "AKTIF").length || 0
      });
    } catch (error) {
      console.error("Failed to fetch pegawai:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (page === 1) {
      fetchPegawai(search, 1);
    } else {
      setPage(1);
    }
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Pegawai</h1>
            <p className="text-gray-600 mt-2">
              Daftar lengkap pegawai Badan Kesbangpol Kabupaten Sumbawa Barat
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            <Download size={20} />
            Export Data
          </button>
        </div>

        {/* Search & Filter */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari pegawai berdasarkan nama atau NIP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <button type="submit" className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors font-medium">
            Cari
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
            <Filter size={18} />
            Filter
          </button>
        </form>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">Total Pegawai</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-green-500">
            <p className="text-gray-500 text-sm font-medium">Pegawai Aktif</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.aktif}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">Cuti</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">0</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">Pensiun</p>
            <p className="text-3xl font-bold text-gray-400 mt-1">0</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Nama / NIP
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Jabatan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Bidang
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Gol/Pangkat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                        <p className="text-gray-500 animate-pulse">Memuat data pegawai...</p>
                      </div>
                    </td>
                  </tr>
                ) : pegawaiList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      Tidak ada data pegawai ditemukan.
                    </td>
                  </tr>
                ) : (
                  pegawaiList.map((p) => (
                    <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{p.nama}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{p.nip}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {p.jabatan}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                          {p.bidang?.nama || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {p.golonganRuang}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.statusPegawai === "AKTIF" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {p.statusPegawai}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-4">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Info & Controls */}
        {!loading && (
          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              Menampilkan <span className="text-gray-900">{pegawaiList.length}</span> dari <span className="text-gray-900">{stats.total}</span> pegawai
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                      page === p
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Halaman Selanjutnya"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
