package com.jgroup.jtasks.projects.boards;

import com.jgroup.jtasks.projects.projects.ProjectResponse;

import java.time.Instant;
import java.util.UUID;

public record BoardResponse(
        UUID id,
        ProjectResponse project,
        String name,
        Float order,
        Instant createdAt,
        Instant updatedAt) {
}
