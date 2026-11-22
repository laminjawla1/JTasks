package com.jgroup.jtasks.workspaces.dto;

import com.jgroup.jtasks.workspaces.enums.WorkspaceStatus;

import java.time.Instant;
import java.util.UUID;

public record WorkspaceResponse(
        UUID id,
        String name,
        String description,
        String slug,
        WorkspaceStatus status,
        Instant createdAt,
        Instant updatedAt
) { }
