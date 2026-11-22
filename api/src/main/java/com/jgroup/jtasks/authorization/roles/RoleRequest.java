package com.jgroup.jtasks.authorization.roles;

import java.util.Set;
import java.util.UUID;

public record RoleRequest(String name, Set<UUID> privilegeIds) {
}
