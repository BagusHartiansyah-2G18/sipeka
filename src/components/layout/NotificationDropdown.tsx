"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Info, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Pengajuan Baru",
      message: "Budi Setiawan mengajukan Cuti Tahunan. Butuh persetujuan Anda.",
      createdAt: "2 menit yang lalu",
      isRead: false,
      type: 'info'
    },
    {
      id: "2",
      title: "Cuti Disetujui",
      message: "Pengajuan Cuti Sakit Anda telah disetujui oleh Atasan 1.",
      createdAt: "1 jam yang lalu",
      isRead: true,
      type: 'success'
    },
    {
      id: "3",
      title: "KGB Mendatang",
      message: "Kenaikan Gaji Berkala Anda akan jatuh tempo dalam 30 hari.",
      createdAt: "Kemarin",
      isRead: false,
      type: 'warning'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Pemberitahuan"
        className={`p-2 rounded-lg transition-all relative ${isOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn origin-top-right">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Notifikasi</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      n.type === 'success' ? 'bg-green-100 text-green-600' : 
                      n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {n.type === 'success' ? <Check size={16} /> : n.type === 'warning' ? <AlertCircle size={16} /> : <Info size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                          <Clock size={10} />
                          {n.createdAt}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed line-clamp-2 ${!n.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                        {n.message}
                      </p>
                    </div>
                  </div>
                  {!n.isRead && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto text-gray-200 mb-2" />
                <p className="text-xs text-gray-500">Tidak ada notifikasi baru</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <Link 
              href="/dashboard/notifications" 
              className="text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors"
            >
              Lihat semua aktivitas
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
