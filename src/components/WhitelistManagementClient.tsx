"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";

interface WhiteListEntry {
  id: number;
  email: string;
  memo: string | null;
}

interface WhitelistManagementClientProps {
  initialWhitelist: WhiteListEntry[];
}

export default function WhitelistManagementClient({ initialWhitelist }: WhitelistManagementClientProps) {
  const [whitelist, setWhitelist] = useState(initialWhitelist);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  
  const [formData, setFormData] = useState({
    email: "",
    memo: "",
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setWhitelist(initialWhitelist);
  }, [initialWhitelist]);

  const isAllSelected = useMemo(() => whitelist.length > 0 && selectedIds.size === whitelist.length, [selectedIds, whitelist]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(whitelist.map(w => w.id)));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add email");
      
      setFormData({ email: "", memo: "" });
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
      const response = await fetch("/api/whitelist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error("Failed to delete entries");

      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOne = async (id: number) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/whitelist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });

      if (!response.ok) throw new Error("Failed to delete entry");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">이메일</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
              placeholder="example@email.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">메모</label>
            <input
              type="text"
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB] transition-all"
              placeholder="메모 입력"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#39C5BB] px-4 py-2 text-sm font-bold text-white hover:bg-[#2fa098] disabled:opacity-50 transition-colors shadow-lg shadow-[#39C5BB]/20"
          >
            <Plus size={16} />
            추가
          </button>
        </div>
      </form>

      {/* 목록 테이블 */}
      <div>
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">등록된 이메일 ({whitelist.length})</h3>
          {selectedIds.size > 0 && (
            <button
              onClick={handleDeleteMany}
              className="flex items-center gap-2 rounded-lg bg-red-500/20 px-3 py-1.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/30"
            >
              <Trash2 size={14} />
              선택 삭제
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <table className="min-w-full divide-y divide-white/10 text-center">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-4 py-3 w-16 align-middle">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-300 w-64">
                  이메일
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  메모
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-300 w-20">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {whitelist.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                    등록된 화이트리스트가 없습니다.
                  </td>
                </tr>
              ) : (
                whitelist.map((entry) => (
                  <tr 
                    key={entry.id} 
                    className={`transition-colors duration-200 ${selectedIds.has(entry.id) ? 'bg-[#39C5BB]/10' : 'hover:bg-white/5'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(entry.id)}
                          onChange={() => handleSelectOne(entry.id)}
                          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left">
                      <span className="text-sm text-white">{entry.email}</span>
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-gray-400">
                      {entry.memo || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteOne(entry.id)}
                        className="rounded-lg p-1.5 text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
