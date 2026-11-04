package com.jgroup.jtasks.users;

import java.util.UUID;

public record LoginResponse(
        String token,
        UUID id,
        String firstName,
        String lastName,
        String email
) { }
