import { useMembershipStore } from "@/store/store";
import { useContextStore } from "@/store/contextStore";

export function useActiveWorkspaceId() {
  const memberships = useMembershipStore((s) => s.memberships);
  const active = useContextStore((s) => s.activeWorkspaceId);
  const valid = memberships?.some((m) => String(m.workspace.id) === active);
  return valid ? active : null;
}
