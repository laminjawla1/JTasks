package com.jgroup.jtasks.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRequest(
    @NotBlank(message = "First name is required")
    @Size(min = 3, max = 50, message = "First name size must be between 3 and 50")
    String firstName,

    @NotBlank(message = "Last name is required")
    @Size(min = 3, max = 50, message = "Last name size must be between 3 and 50")
    String lastName,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a well-formed email address")
    @Size(max = 100, message = "Email size must not exceed 100")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password length must be between 8 and 128")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
        message = "must contain at least one uppercase letter, one lowercase letter, one number, and one special symbol."
    )
    String password
) { }
