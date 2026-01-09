"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, X, ExternalLink, GripVertical, Save } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface VocaSite {
  id: number;
  name: string;
  url: string;
  show: boolean;
  order: number;
}

interface SiteManagementClientProps {
  initialSites: VocaSite[];
}

// Sortable Row Component
function SortableRow({ site, selectedIds, handleSelectOne, openModal }: {
  site: VocaSite;
  selectedIds: Set<number>;
  handleSelectOne: (id: number) => void;
  openModal: (site: VocaSite) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: site.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? 'relative' as const : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`transition-colors duration-200 ${selectedIds.has(site.id) ? 'bg-[#39C5BB]/10' : 'hover:bg-white/5'} ${isDragging ? 'bg-white/10 shadow-xl' : ''}`}
    >
      <td className="px-4 py-4 text-center">
        <div className="flex justify-center items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <GripVertical size={16} />
          </button>
          <input
            type="checkbox"
            checked={selectedIds.has(site.id)}
            onChange={() => handleSelectOne(site.id)}
            className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
          />
        </div>
      </td>
      <td className="px-6 py-4 text-left">
        <span className="text-sm font-medium text-white">{site.name}</span>
      </td>
      <td className="px-6 py-4 text-left">
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-300 hover:text-[#39C5BB] hover:underline transition-colors truncate block max-w-xs"
        >
          {site.url}
        </a>
      </td>
      <td className="px-6 py-4 text-center">
        {site.show ? (
          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">ON</span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-400">OFF</span>
        )}
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => openModal(site)}
          className="rounded-lg p-2 text-gray-400 transition-all hover:bg-white/10 hover:text-white hover:scale-110 mx-auto"
          title="수정"
        >
          <Edit size={18} />
        </button>
      </td>
    </tr>
  );
}

export default function SiteManagementClient({ initialSites }: SiteManagementClientProps) {
  const [sites, setSites] = useState(initialSites);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSite, setCurrentSite] = useState<VocaSite | null>(null);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    show: true,
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const prevInitialSitesRef = useRef(initialSites);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (prevInitialSitesRef.current !== initialSites) {
      setSites(initialSites);
      setIsOrderChanged(false);
      prevInitialSitesRef.current = initialSites;
    }
  }, [initialSites]);

  const isAllSelected = useMemo(() => sites.length > 0 && selectedIds.size === sites.length, [selectedIds, sites]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(sites.map(s => s.id)));
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

  const openModal = (site?: VocaSite) => {
    if (site) {
      setCurrentSite(site);
      setFormData({
        name: site.name,
        url: site.url,
        show: site.show,
      });
    } else {
      setCurrentSite(null);
      setFormData({
        name: "",
        url: "",
        show: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSite(null);
    setFormData({
      name: "",
      url: "",
      show: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const url = currentSite ? `/api/sites/${currentSite.id}` : "/api/sites";
      const method = currentSite ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save site");
      
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
      const response = await fetch(`/api/sites`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error("Failed to delete sites");

      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSites((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        setIsOrderChanged(true);
        return newItems;
      });
    }
  };

  const handleSaveOrder = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const updatedSites = sites.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      const response = await fetch("/api/sites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedSites }),
      });

      if (!response.ok) throw new Error("Failed to update order");
      
      setIsOrderChanged(false);
      router.refresh();
      alert("순서가 저장되었습니다.");
    } catch (error) {
      console.error(error);
      alert("순서 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button
              onClick={handleDeleteMany}
              disabled={isOrderChanged}
              className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 font-bold text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              {isAllSelected ? '모두 제거' : '선택 삭제'}
            </button>
          )}
          {isOrderChanged && (
            <button
              onClick={handleSaveOrder}
              className="flex items-center gap-2 rounded-lg bg-[#39C5BB] px-4 py-2 font-bold text-white transition-all hover:bg-[#2fa098] shadow-lg shadow-[#39C5BB]/20"
            >
              <Save size={16} />
              순서 저장
            </button>
          )}
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-[#39C5BB] px-4 py-2 font-bold text-white transition-colors hover:bg-[#2fa098] shadow-lg shadow-[#39C5BB]/20"
        >
          <Plus size={20} />
          사이트 추가
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="min-w-full divide-y divide-white/10 text-center">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-4 py-3 w-24 align-middle text-center">
                  <div className="flex flex-col items-center justify-center gap-1 pl-8">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">전체</span>
                  </div>
                </th>
                <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300 w-48">
                  이름
                </th>
                <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300">
                  URL
                </th>
                <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-32">
                  위젯표시
                </th>
                <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-24">
                  수정
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <SortableContext
                items={sites.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {sites.map((site) => (
                  <SortableRow
                    key={site.id}
                    site={site}
                    selectedIds={selectedIds}
                    handleSelectOne={handleSelectOne}
                    openModal={openModal}
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {currentSite ? "사이트 수정" : "사이트 추가"}
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
                  placeholder="사이트 이름"
                  required
                />
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

              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
                <input
                  type="checkbox"
                  id="show"
                  checked={formData.show}
                  onChange={(e) => setFormData({ ...formData, show: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-[#39C5BB] focus:ring-[#39C5BB]"
                />
                <label htmlFor="show" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
                  푸터에 노출
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
