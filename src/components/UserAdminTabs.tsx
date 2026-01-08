"use client";

import { useState } from "react";
import UserManagementClient from "./UserManagementClient";
import WhitelistManagementClient from "./WhitelistManagementClient";
import { AppUser } from "@/services/userService";

interface WhiteListEntry {
  id: number;
  email: string;
  memo: string | null;
}

interface UserAdminTabsProps {
  initialUsers: AppUser[];
  initialWhitelist: WhiteListEntry[];
}

export default function UserAdminTabs({ initialUsers, initialWhitelist }: UserAdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'whitelist'>('users');

  return (
    <div>
      <div className="mb-8 border-b border-white/10">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-medium transition-all relative ${
              activeTab === 'users' 
                ? 'text-[#39C5BB]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            사용자 목록
            {activeTab === 'users' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#39C5BB] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('whitelist')}
            className={`pb-4 text-sm font-medium transition-all relative ${
              activeTab === 'whitelist' 
                ? 'text-[#39C5BB]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            화이트리스트
            {activeTab === 'whitelist' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#39C5BB] rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <UserManagementClient initialUsers={initialUsers} initialWhitelist={[]} />
      ) : (
        <WhitelistManagementClient initialWhitelist={initialWhitelist} />
      )}
    </div>
  );
}
