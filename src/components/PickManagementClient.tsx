"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, X, ExternalLink } from "lucide-react";
import Image from "next/image";

interface VocaPick {
  id: number;
  video_id: string;
  comment: string | null;
}

interface PickManagementClientProps {
  initialPicks: VocaPick[];
}

export default function PickManagementClient({ initialPicks }: PickManagementClientProps) {
  const [picks, setPicks] = useState(initialPicks);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPick, setCurrentPick] = useState<VocaPick | null>(null);
  const [formData, setFormData] = useState({ videoId: "", comment: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPicks(initialPicks);
  }, [initialPicks]);

  const isAllSelected = useMemo(() => picks.length > 0 && selectedIds.size === picks.length, [selectedIds, picks]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(picks.map(p => p.id)));
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

  const openModal = (pick?: VocaPick) => {
    if (pick) {
      setCurrentPick(pick);
      setFormData({ videoId: pick.video_id, comment: pick.comment || "" });
    } else {
      setCurrentPick(null);
      setFormData({ videoId: "", comment: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPick(null);
    setFormData({ videoId: "", comment: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const url = currentPick ? `/api/picks/${currentPick.id}` : "/api/picks";
      const method = currentPick ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save pick");
      
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
      const response = await fetch(`/api/picks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error("Failed to delete picks");

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
          영상 추가
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
        <table className="min-w-full divide-y divide-white/10 text-center">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="px-4 py-3 w-20 align-middle">
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
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-32">
                썸네일
              </th>
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300 w-48">
                유튜브 ID
              </th>
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300">
                설명
              </th>
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-24">
                수정
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {picks.map((pick) => (
              <tr 
                key={pick.id} 
                className={`transition-colors duration-200 ${selectedIds.has(pick.id) ? 'bg-[#39C5BB]/10' : 'hover:bg-white/5'}`}
              >
                <td className="px-4 py-4">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(pick.id)}
                      onChange={() => handleSelectOne(pick.id)}
                      className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-black shadow-md border border-white/10 mx-auto">
                    <Image
                      src={`https://img.youtube.com/vi/${pick.video_id}/mqdefault.jpg`}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-left text-sm font-mono text-gray-300">
                  <a
                    href={`https://www.youtube.com/watch?v=${pick.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#39C5BB] hover:underline transition-colors"
                  >
                    {pick.video_id}
                    <ExternalLink size={14} className="opacity-70" />
                  </a>
                </td>
                <td className="px-6 py-4 text-left text-sm text-gray-200">
                  <p className="line-clamp-2 leading-relaxed">{pick.comment || "-"}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openModal(pick)}
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
                {currentPick ? "영상 수정" : "영상 추가"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  YouTube Video ID
                </label>
                <input
                  type="text"
                  value={formData.videoId}
                  onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  placeholder="예: dQw4w9WgXcQ"
                  required
                />
                {formData.videoId && (
                  <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl bg-black border border-white/10 shadow-lg">
                    <Image
                      src={`https://img.youtube.com/vi/${formData.videoId}/mqdefault.jpg`}
                      alt="Preview"
                      width={320}
                      height={180}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  설명 (선택)
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  rows={3}
                  placeholder="영상에 대한 설명을 입력하세요."
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
