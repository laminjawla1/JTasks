import { AuthUser, Membership, User } from "@/definitions";

export interface AuthStore {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface MembershipStore {
  memberships: Membership[];
  update: (memberships: Membership[]) => void;
}
