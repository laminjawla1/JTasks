package com.jgroup.jtasks.workspaces.dto;

import com.jgroup.jtasks.workspaces.enums.Status;

import java.time.Instant;
import java.util.UUID;

public record WorkspaceResponse(
        UUID id,
        String name,
        String description,
        String slug,
        Status status,
        Instant createdAt,
        Instant updatedAt
) { }
