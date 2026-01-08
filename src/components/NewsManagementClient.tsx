"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, X, ExternalLink, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import Pagination from "./Pagination";

interface VocaNews {
  id: number;
  category: string;
  date: string;
  url: string;
  title_jp: string;
  title_kr: string;
}

interface NewsManagementClientProps {
  initialNews: VocaNews[];
}

const ITEMS_PER_PAGE = 10;

export default function NewsManagementClient({ initialNews }: NewsManagementClientProps) {
  const [newsList, setNewsList] = useState(initialNews);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<VocaNews | null>(null);
  
  // 탭 및 페이지네이션 상태
  const [activeTab, setActiveTab] = useState<'hatsuneMiku' | 'vocaloid'>('hatsuneMiku');
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    category: "hatsuneMiku",
    date: "",
    url: "",
    title_jp: "",
    title_kr: "",
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setNewsList(initialNews);
  }, [initialNews]);

  // 필터링된 뉴스 목록
  const filteredNews = useMemo(() => {
    return newsList.filter(news => news.category === activeTab);
  }, [newsList, activeTab]);

  // 페이지네이션된 뉴스 목록
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNews, currentPage]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

  // 탭 변경 시 페이지 초기화 및 선택 초기화
  const handleTabChange = (tab: 'hatsuneMiku' | 'vocaloid') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const isAllSelected = useMemo(() => paginatedNews.length > 0 && paginatedNews.every(n => selectedIds.has(n.id)), [selectedIds, paginatedNews]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelectedIds = new Set(selectedIds);
      paginatedNews.forEach(n => newSelectedIds.add(n.id));
      setSelectedIds(newSelectedIds);
    } else {
      const newSelectedIds = new Set(selectedIds);
      paginatedNews.forEach(n => newSelectedIds.delete(n.id));
      setSelectedIds(newSelectedIds);
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

  const openModal = (news?: VocaNews) => {
    if (news) {
      setCurrentNews(news);
      setFormData({
        category: news.category,
        date: new Date(news.date).toISOString().split('T')[0],
        url: news.url,
        title_jp: news.title_jp,
        title_kr: news.title_kr,
      });
    } else {
      setCurrentNews(null);
      setFormData({
        category: activeTab, // 현재 탭의 카테고리로 기본 설정
        date: new Date().toISOString().split('T')[0],
        url: "",
        title_jp: "",
        title_kr: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNews(null);
    setFormData({
      category: "hatsuneMiku",
      date: "",
      url: "",
      title_jp: "",
      title_kr: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const url = currentNews ? `/api/news/${currentNews.id}` : "/api/news";
      const method = currentNews ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save news");
      
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
      const response = await fetch(`/api/news`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error("Failed to delete news");

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
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-4 gap-4">
        {/* 탭 메뉴 (좌측 하단 배치 -> 테이블 바로 위) */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => handleTabChange('hatsuneMiku')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'hatsuneMiku' 
                ? 'bg-[#39C5BB] text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            하츠네 미쿠
          </button>
          <button
            onClick={() => handleTabChange('vocaloid')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'vocaloid' 
                ? 'bg-[#39C5BB] text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            보컬로이드
          </button>
        </div>

        {/* 버튼 그룹 (우측) */}
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button
              onClick={handleDeleteMany}
              className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 font-bold text-red-400 transition-colors hover:bg-red-500/30"
            >
              <Trash2 size={16} />
              {isAllSelected ? '모두 제거' : '선택 삭제'}
            </button>
          )}
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 rounded-lg bg-[#39C5BB] px-4 py-2 font-bold text-white transition-colors hover:bg-[#2fa098] shadow-lg shadow-[#39C5BB]/20"
          >
            <Plus size={20} />
            뉴스 추가
          </button>
        </div>
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
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300 w-32">
                날짜
              </th>
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300">
                제목
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
            {paginatedNews.map((news) => (
              <tr 
                key={news.id} 
                className={`transition-colors duration-200 ${selectedIds.has(news.id) ? 'bg-[#39C5BB]/10' : 'hover:bg-white/5'}`}
              >
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(news.id)}
                      onChange={() => handleSelectOne(news.id)}
                      className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-left text-sm text-gray-300 whitespace-nowrap">
                  {new Date(news.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-left">
                  <span className="text-sm font-medium text-white line-clamp-2">
                    {news.title_kr || news.title_jp}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-white/10 p-2 text-gray-300 hover:bg-white/20 hover:text-white transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openModal(news)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {currentNews ? "뉴스 수정" : "뉴스 추가"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  카테고리
                </label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.category === 'hatsuneMiku' ? 'border-teal-500 bg-teal-500/10 text-white' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    <input
                      type="radio"
                      name="category"
                      value="hatsuneMiku"
                      checked={formData.category === 'hatsuneMiku'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="hidden"
                    />
                    <span>하츠네 미쿠</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.category === 'vocaloid' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    <input
                      type="radio"
                      name="category"
                      value="vocaloid"
                      checked={formData.category === 'vocaloid'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="hidden"
                    />
                    <span>보컬로이드</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  날짜
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
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
                  제목 (일본어)
                </label>
                <textarea
                  value={formData.title_jp}
                  onChange={(e) => setFormData({ ...formData, title_jp: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  rows={2}
                  placeholder="뉴스 원문 제목"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  제목 (한국어) - 선택
                </label>
                <textarea
                  value={formData.title_kr}
                  onChange={(e) => setFormData({ ...formData, title_kr: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
                  rows={2}
                  placeholder="뉴스 번역 제목"
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
