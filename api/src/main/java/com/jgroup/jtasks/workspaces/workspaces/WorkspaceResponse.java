package com.jgroup.jtasks.workspaces.workspaces;

import java.time.Instant;
import java.util.UUID;

public record WorkspaceResponse(
        UUID id,
        String name,
        String slug,
        Status status,
        Instant createdAt,
        Instant updatedAt
) { }
