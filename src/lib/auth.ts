// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { Role } from "@/types";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        nip: { label: "NIP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.nip || !credentials?.password) return null;

        // Find user by NIP through pegawai relationship
        const pegawai = await prisma.pegawai.findUnique({
          where: { nip: credentials.nip },
          include: { user: true, bidang: true },
        });

        if (!pegawai || !pegawai.user) return null;

        const user = pegawai.user;
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          nip: pegawai.nip,
          role: user.role as Role,
          nama: pegawai.nama,
          bidang: pegawai.bidang?.kode,
          pegawaiId: pegawai.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.nama = user.nama;
        token.nip = user.nip;
        token.bidang = user.bidang;
        token.pegawaiId = user.pegawaiId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.nama = token.nama;
        session.user.nip = token.nip;
        session.user.bidang = token.bidang;
        session.user.pegawaiId = token.pegawaiId;
      }
      return session;
    },
  },
};
