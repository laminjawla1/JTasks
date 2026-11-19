package com.jgroup.jtasks.workspaces.members;

import com.jgroup.jtasks.authorization.roles.RoleResponse;
import com.jgroup.jtasks.commons.MembershipStatus;
import com.jgroup.jtasks.users.UserResponse;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record WorkspaceMemberResponse(
        UUID id,
        UserResponse user,
        List<RoleResponse> role,
        MembershipStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
