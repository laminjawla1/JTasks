package com.jgroup.jtasks.users;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String firstName,
    String lastName,
    String email,
    Status status,
    Instant createdAt,
    Instant updatedAt) {
}
