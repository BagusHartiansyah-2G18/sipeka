// src/types/next-auth.d.ts
// Extend NextAuth types with custom session/token properties
import { Role, Bidang } from "@/types";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      nama: string;
      nip: string;
      bidang?: string;
      pegawaiId: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    nama: string;
    nip: string;
    bidang?: string;
    pegawaiId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    nama: string;
    nip: string;
    bidang?: string;
    pegawaiId: string;
  }
}
