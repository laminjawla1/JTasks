package com.jgroup.jtasks.workspaces;

import java.time.Instant;
import java.util.UUID;

public record WorkspaceResponse(
        UUID id,
        String name,
        Status status,
        Instant createdAt,
        Instant updatedAt
) { }
