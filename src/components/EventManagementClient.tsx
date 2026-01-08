"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, X, ExternalLink, Calendar } from "lucide-react";

interface VocaEvent {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  url: string;
  comment: string | null;
}

interface EventManagementClientProps {
  initialEvents: VocaEvent[];
}

export default function EventManagementClient({ initialEvents }: EventManagementClientProps) {
  const [events, setEvents] = useState(initialEvents);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<VocaEvent | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    url: "",
    comment: "",
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const isAllSelected = useMemo(() => events.length > 0 && selectedIds.size === events.length, [selectedIds, events]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(events.map(e => e.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const openModal = (event?: VocaEvent) => {
    if (event) {
      setCurrentEvent(event);
      setFormData({
        name: event.name,
        startDate: new Date(event.start_date).toISOString().split('T')[0],
        endDate: new Date(event.end_date).toISOString().split('T')[0],
        url: event.url,
        comment: event.comment || "",
      });
    } else {
      setCurrentEvent(null);
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        url: "",
        comment: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEvent(null);
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      url: "",
      comment: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const url = currentEvent ? `/api/events/${currentEvent.id}` : "/api/events";
      const method = currentEvent ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save event");
      
      closeModal();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMany = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`${selectedIds.size}개의 항목을 정말로 삭제하시겠습니까?`)) return;
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/events`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error("Failed to delete events");

      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          {selectedIds.size > 0 && (
            <button
              onClick={handleDeleteMany}
              className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 font-bold text-red-400 transition-colors hover:bg-red-500/30"
            >
              <Trash2 size={16} />
              {isAllSelected ? '모두 제거' : '선택 삭제'}
            </button>
          )}
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-[#39C5BB] px-4 py-2 font-bold text-white transition-colors hover:bg-[#2fa098] shadow-lg shadow-[#39C5BB]/20"
        >
          <Plus size={20} />
          이벤트 추가
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
        <table className="min-w-full divide-y divide-white/10 text-center">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="px-4 py-3 w-20 align-middle text-center">
                <div className="flex flex-col items-center justify-center gap-1">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">전체</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300 min-w-[250px]">
                이름
              </th>
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300 w-32">
                개최일
              </th>
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300 w-48">
                설명
              </th>
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-24">
                링크
              </th>
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-24">
                수정
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {events.map((event) => (
              <tr 
                key={event.id} 
                className={`transition-colors duration-200 ${selectedIds.has(event.id) ? 'bg-[#39C5BB]/10' : 'hover:bg-white/5'}`}
              >
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(event.id)}
                      onChange={() => handleSelectOne(event.id)}
                      className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-left">
                  <span className="text-sm font-medium text-white line-clamp-2">{event.name}</span>
                </td>
                <td className="px-6 py-4 text-left text-sm text-gray-300">
                  <div className="flex flex-col gap-0.5">
                    <span>{new Date(event.start_date).toLocaleDateString()}</span>
                    <span className="text-xs text-gray-500">~ {new Date(event.end_date).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-left text-sm text-gray-300">
                  <p className="line-clamp-1">{event.comment || "-"}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-white/10 p-2 text-gray-300 hover:bg-white/20 hover:text-white transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openModal(event)}
                    className="rounded-lg p-2 text-gray-400 transition-all hover:bg-white/10 hover:text-white hover:scale-110 mx-auto"
                    title="수정"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {currentEvent ? "이벤트 수정" : "이벤트 추가"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  이름
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  placeholder="이벤트 이름"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    시작일
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    종료일
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  비고 (선택)
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  rows={3}
                  placeholder="이벤트 관련 메모"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[#39C5BB] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#2fa098] disabled:opacity-50 transition-colors shadow-lg shadow-[#39C5BB]/20"
                >
                  {loading ? "저장 중..." : "저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
