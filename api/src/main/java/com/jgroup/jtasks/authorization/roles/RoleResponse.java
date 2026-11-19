package com.jgroup.jtasks.authorization.roles;

import java.time.Instant;
import java.util.UUID;

public record RoleResponse(UUID id, String name, Instant createdAt, Instant updatedAt) {
}
