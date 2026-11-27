package com.jgroup.jtasks.authorization.roles;

import com.jgroup.jtasks.authorization.privileges.PrivilegeResponse;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record RoleResponse(
        UUID id,
        String name,
        Boolean systemRole,
        Set<PrivilegeResponse> privileges,
        Instant createdAt,
        Instant updatedAt
) { }
