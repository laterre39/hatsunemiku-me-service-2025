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

interface VocaCommunity {
  id: number;
  name: string;
  description: string;
  url: string;
  order: number;
}

interface CommunityManagementClientProps {
  initialCommunities: VocaCommunity[];
}

// Sortable Row Component
function SortableRow({ community, selectedIds, handleSelectOne, openModal }: {
  community: VocaCommunity;
  selectedIds: Set<number>;
  handleSelectOne: (id: number) => void;
  openModal: (community: VocaCommunity) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: community.id });

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
      className={`transition-colors duration-200 ${selectedIds.has(community.id) ? 'bg-[#39C5BB]/10' : 'hover:bg-white/5'} ${isDragging ? 'bg-white/10 shadow-xl' : ''}`}
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
            checked={selectedIds.has(community.id)}
            onChange={() => handleSelectOne(community.id)}
            className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
          />
        </div>
      </td>
      <td className="px-6 py-4 text-left">
        <span className="text-sm font-medium text-white">{community.name}</span>
      </td>
      <td className="px-6 py-4 text-left text-sm text-gray-300">
        <p className="line-clamp-2">{community.description}</p>
      </td>
      <td className="px-6 py-4 text-center">
        <a
          href={community.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-white/10 p-2 text-gray-300 hover:bg-white/20 hover:text-white transition-colors"
        >
          <ExternalLink size={16} />
        </a>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => openModal(community)}
          className="rounded-lg p-2 text-gray-400 transition-all hover:bg-white/10 hover:text-white hover:scale-110 mx-auto"
          title="수정"
        >
          <Edit size={18} />
        </button>
      </td>
    </tr>
  );
}

export default function CommunityManagementClient({ initialCommunities }: CommunityManagementClientProps) {
  const [communities, setCommunities] = useState(initialCommunities);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCommunity, setCurrentCommunity] = useState<VocaCommunity | null>(null);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const prevInitialCommunitiesRef = useRef(initialCommunities);

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
    if (prevInitialCommunitiesRef.current !== initialCommunities) {
      setCommunities(initialCommunities);
      setIsOrderChanged(false);
      prevInitialCommunitiesRef.current = initialCommunities;
    }
  }, [initialCommunities]);

  const isAllSelected = useMemo(() => communities.length > 0 && selectedIds.size === communities.length, [selectedIds, communities]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(communities.map(c => c.id)));
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

  const openModal = (community?: VocaCommunity) => {
    if (community) {
      setCurrentCommunity(community);
      setFormData({
        name: community.name,
        description: community.description,
        url: community.url,
      });
    } else {
      setCurrentCommunity(null);
      setFormData({
        name: "",
        description: "",
        url: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCommunity(null);
    setFormData({
      name: "",
      description: "",
      url: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const url = currentCommunity ? `/api/communities/${currentCommunity.id}` : "/api/communities";
      const method = currentCommunity ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save community");
      
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
      const response = await fetch(`/api/communities`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error("Failed to delete communities");

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
      setCommunities((items) => {
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
      const updatedCommunities = communities.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      const response = await fetch("/api/communities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedCommunities }),
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
          커뮤니티 추가
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
                  설명
                </th>
                <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-32">
                  링크
                </th>
                <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-24">
                  수정
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <SortableContext
                items={communities.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {communities.map((community) => (
                  <SortableRow
                    key={community.id}
                    community={community}
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
                {currentCommunity ? "커뮤니티 수정" : "커뮤니티 추가"}
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
                  placeholder="커뮤니티 이름"
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

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  rows={3}
                  placeholder="커뮤니티 설명"
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
