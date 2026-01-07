"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, X, ExternalLink, ListMusic } from "lucide-react";
import { FaYoutube, FaSpotify } from "react-icons/fa";

interface VocaPlaylist {
  id: number;
  playlist_id: string;
  platform: string;
  name: string;
  description: string | null;
  creator: string | null;
  is_slider: boolean;
}

interface PlaylistManagementClientProps {
  initialPlaylists: VocaPlaylist[];
}

export default function PlaylistManagementClient({ initialPlaylists }: PlaylistManagementClientProps) {
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<VocaPlaylist | null>(null);
  
  const [formData, setFormData] = useState({
    playlistId: "",
    platform: "youtube",
    name: "",
    description: "",
    creator: "",
    isSlider: false,
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPlaylists(initialPlaylists);
  }, [initialPlaylists]);

  const isAllSelected = useMemo(() => playlists.length > 0 && selectedIds.size === playlists.length, [selectedIds, playlists]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(playlists.map(p => p.id)));
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

  const openModal = (playlist?: VocaPlaylist) => {
    if (playlist) {
      setCurrentPlaylist(playlist);
      setFormData({
        playlistId: playlist.playlist_id,
        platform: playlist.platform,
        name: playlist.name,
        description: playlist.description || "",
        creator: playlist.creator || "",
        isSlider: playlist.is_slider,
      });
    } else {
      setCurrentPlaylist(null);
      setFormData({
        playlistId: "",
        platform: "youtube",
        name: "",
        description: "",
        creator: "",
        isSlider: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPlaylist(null);
    setFormData({
      playlistId: "",
      platform: "youtube",
      name: "",
      description: "",
      creator: "",
      isSlider: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // 추천 노출 개수 제한 로직
    if (formData.isSlider) {
      const currentSliderCount = playlists.filter(p => p.is_slider).length;
      // 수정 시: 현재 항목이 이미 켜져있었다면 카운트에서 제외할 필요 없음 (그대로 유지)
      // 하지만 꺼져있던걸 켜는 경우라면 체크 필요
      const isTurningOn = currentPlaylist ? !currentPlaylist.is_slider : true;

      if (isTurningOn && currentSliderCount >= 3) {
        alert("추천 노출(슬라이더)은 최대 3개까지만 가능합니다.\n다른 항목을 비활성화한 후 다시 시도해주세요.");
        return;
      }
    }

    setLoading(true);

    try {
      const url = currentPlaylist ? `/api/playlists/${currentPlaylist.id}` : "/api/playlists";
      const method = currentPlaylist ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save playlist");
      
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
      const response = await fetch(`/api/playlists`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error("Failed to delete playlists");

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
          플레이리스트 추가
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
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-32">
                플랫폼
              </th>
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300">
                제목
              </th>
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300 w-32">
                제작자
              </th>
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-48">
                추천표시
              </th>
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-24">
                수정
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {playlists.map((playlist) => (
              <tr 
                key={playlist.id} 
                className={`transition-colors duration-200 ${selectedIds.has(playlist.id) ? 'bg-[#39C5BB]/10' : 'hover:bg-white/5'}`}
              >
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(playlist.id)}
                      onChange={() => handleSelectOne(playlist.id)}
                      className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    {playlist.platform === 'youtube' ? (
                      <FaYoutube className="text-red-500 text-xl" />
                    ) : (
                      <FaSpotify className="text-green-500 text-xl" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{playlist.name}</span>
                    <span className="text-xs text-gray-400 font-mono">{playlist.playlist_id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-left text-sm text-gray-300">
                  {playlist.creator || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {playlist.is_slider ? (
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">ON</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-400">OFF</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openModal(playlist)}
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
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {currentPlaylist ? "플레이리스트 수정" : "플레이리스트 추가"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  플랫폼
                </label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.platform === 'youtube' ? 'border-red-500 bg-red-500/10 text-white' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    <input
                      type="radio"
                      name="platform"
                      value="youtube"
                      checked={formData.platform === 'youtube'}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="hidden"
                    />
                    <FaYoutube className="text-xl" />
                    <span>YouTube</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.platform === 'spotify' ? 'border-green-500 bg-green-500/10 text-white' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    <input
                      type="radio"
                      name="platform"
                      value="spotify"
                      checked={formData.platform === 'spotify'}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="hidden"
                    />
                    <FaSpotify className="text-xl" />
                    <span>Spotify</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  플레이리스트 ID
                </label>
                <input
                  type="text"
                  value={formData.playlistId}
                  onChange={(e) => setFormData({ ...formData, playlistId: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  placeholder="예: PL4DYOoQTb3ib..."
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  placeholder="플레이리스트 제목"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  제작자 (선택)
                </label>
                <input
                  type="text"
                  value={formData.creator}
                  onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  placeholder="제작자 이름"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  설명 (선택)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  rows={3}
                  placeholder="플레이리스트 설명"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
                <input
                  type="checkbox"
                  id="isSlider"
                  checked={formData.isSlider}
                  onChange={(e) => setFormData({ ...formData, isSlider: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-[#39C5BB] focus:ring-[#39C5BB]"
                />
                <label htmlFor="isSlider" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
                  추천 플리(슬라이더)에 노출
                </label>
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
