package com.jgroup.jtasks.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRequest(
    @NotBlank
    @Size(min = 3, max = 50)
    String firstName,

    @NotBlank
    @Size(min = 3, max = 50)
    String lastName,

    @NotBlank
    @Email
    @Size(max = 100)
    String email,

    @NotBlank
    @Size(min = 8, max = 128)
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
        message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special symbol."
    )
    String password,

    @NotBlank
    @Size(min = 3, max = 100) String workspaceName
) { }
