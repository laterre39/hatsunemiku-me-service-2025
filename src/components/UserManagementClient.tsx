"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppUser } from "@/services/userService";
import { Shield, User, Trash2, UserCog, Edit, X, ListChecks } from "lucide-react";
import Image from "next/image";
import WhitelistManagementClient from "./WhitelistManagementClient";

interface WhiteListEntry {
  id: number;
  email: string;
  memo: string | null;
}

interface UserManagementClientProps {
  initialUsers: AppUser[];
  initialWhitelist: WhiteListEntry[];
}

export default function UserManagementClient({ initialUsers, initialWhitelist }: UserManagementClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  
  // 모달 관련 상태
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isWhitelistModalOpen, setIsWhitelistModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("USER");

  const router = useRouter();

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const isAllSelected = useMemo(() => users.length > 0 && selectedIds.size === users.length, [selectedIds, users]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(users.map(u => u.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const openRoleModal = (user: AppUser) => {
    setCurrentUser(user);
    setSelectedRole(user.role);
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setCurrentUser(null);
  };

  const handleRoleUpdate = async () => {
    if (loading || !currentUser) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      closeRoleModal();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("역할 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMany = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`${selectedIds.size}개의 계정을 정말로 삭제하시겠습니까?`)) return;
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error("Failed to delete users");

      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("사용자 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return '관리자';
      case 'STAFF': return '에디터';
      default: return '비인가';
    }
  };

  const getRoleChip = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400"><Shield size={12} />관리자</span>;
      case 'STAFF':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-400"><UserCog size={12} />에디터</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-400"><User size={12} />비인가</span>;
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4 min-h-[40px]">
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
          onClick={() => setIsWhitelistModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#39C5BB] px-4 py-2 font-bold text-white transition-colors hover:bg-[#2fa098] shadow-lg shadow-[#39C5BB]/20"
        >
          <ListChecks size={20} />
          화이트리스트 관리
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
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300">
                사용자
              </th>
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-300">
                이메일
              </th>
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300">
                역할
              </th>
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-300 w-24">
                수정
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map((user) => (
              <tr key={user.id} className={`transition-colors duration-200 ${selectedIds.has(user.id) ? 'bg-[#39C5BB]/10' : 'hover:bg-white/5'}`}
              >
                <td className="px-4 py-4">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      onChange={() => handleSelectOne(user.id)}
                      className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-[#39C5BB] focus:ring-[#39C5BB] focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.image || `https://ui-avatars.com/api/?name=${user.name || 'U'}&background=random`}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="text-sm font-medium text-white">{user.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-left text-sm text-gray-300">{user.email}</td>
                <td className="px-6 py-4 text-center">
                  {getRoleChip(user.role)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openRoleModal(user)}
                    className="rounded-lg p-2 text-gray-400 transition-all hover:bg-white/10 hover:text-white hover:scale-110 mx-auto"
                    title="역할 수정"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Update Modal */}
      {isRoleModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                역할 수정
              </h2>
              <button onClick={closeRoleModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-4">
                <span className="font-bold text-white">{currentUser.name}</span> 님의 새로운 역할을 선택하세요.
              </p>
              
              <div className="space-y-2">
                {['USER', 'STAFF', 'ADMIN'].map((role) => (
                  <label
                    key={role}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                      selectedRole === role
                        ? 'border-[#39C5BB] bg-[#39C5BB]/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={selectedRole === role}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="h-4 w-4 border-gray-600 bg-gray-700 text-[#39C5BB] focus:ring-[#39C5BB]"
                      />
                      <span className={`text-sm font-medium ${selectedRole === role ? 'text-white' : 'text-gray-300'}`}>
                        {getRoleLabel(role)}
                      </span>
                    </div>
                    {getRoleChip(role)}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeRoleModal}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleRoleUpdate}
                disabled={loading}
                className="rounded-xl bg-[#39C5BB] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#2fa098] disabled:opacity-50 transition-colors shadow-lg shadow-[#39C5BB]/20"
              >
                {loading ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Whitelist Management Modal */}
      {isWhitelistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                화이트리스트 관리
              </h2>
              <button onClick={() => setIsWhitelistModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <WhitelistManagementClient initialWhitelist={initialWhitelist} />
          </div>
        </div>
      )}
    </div>
  );
}
