package com.jgroup.jtasks.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdate(
    @NotBlank
    @Size(min = 3, max = 50)
    String firstName,

    @NotBlank
    @Size(min = 3, max = 50)
    String lastName,

    @NotBlank
    @Email
    @Size(max = 100)
    String email
) { }
