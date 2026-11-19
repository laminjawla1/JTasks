"use client";

import { create } from "zustand";
import { Membership, User } from "@/definitions";
import Cookies from "js-cookie";
import { AuthStore, MembershipStore } from "./definitions";

export const useMembershipStore = create<MembershipStore>((set) => ({
  memberships: [],
  update: (memberships: Membership[]) => {
    set({ memberships });
  },
}));

export const userAuthStore = create<AuthStore>((set) => {
  const token = Cookies.get("auth_token") || null;
  let user;
  try {
    user = (JSON.parse(Cookies.get("user") || "") as User) || null;
  } catch {
    user = null;
  }

  return {
    token,
    user,
    login: (token: string, user: User) => {
      Cookies.set("auth_token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });

      Cookies.set("user", JSON.stringify(user), {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      set({ token, user });
    },

    logout: () => {
      Cookies.remove("user", { path: "/" });
      Cookies.remove("auth_token", { path: "/" });
      set({ token: null, user: null });
    },
  };
});
