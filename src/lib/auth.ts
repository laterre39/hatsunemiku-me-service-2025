import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID ?? "",
      clientSecret: process.env.NAVER_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // 이메일이 없는 경우 로그인 차단
      if (!user.email) return false;

      // 이미 가입된 사용자인지 확인
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      // 이미 가입된 사용자는 로그인 허용
      if (existingUser) return true;

      // 신규 가입 시 화이트리스트 체크
      const whitelisted = await prisma.whiteList.findUnique({
        where: { email: user.email },
      });

      // 화이트리스트에 있으면 가입 허용, 없으면 차단
      return !!whitelisted;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "database",
  },
};
