package com.jgroup.jtasks.users;

import com.jgroup.jtasks.workspaces.workspaces.WorkspaceResponse;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String firstName,
    String lastName,
    String email,
    Status status,
    Instant createdAt,
    Instant updatedAt,
    WorkspaceResponse workspace) {

    public UserResponse(
        UUID id, String firstName, String lastName, String email, Status status, Instant createdAt, Instant updatedAt
    ) {
        this(id, firstName, lastName, email, status, createdAt, updatedAt, null);
    }
}
