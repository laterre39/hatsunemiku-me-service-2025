import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export interface AppUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

/**
 * 모든 사용자 목록을 조회합니다.
 */
export const getUsers = unstable_cache(
  async (): Promise<AppUser[]> => {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    }));
  },
  ['users-list'], // Cache Key
  { 
    tags: ['users'] // Cache Tag
  }
);
