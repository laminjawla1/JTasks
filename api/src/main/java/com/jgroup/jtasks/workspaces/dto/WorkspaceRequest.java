package com.jgroup.jtasks.workspaces.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WorkspaceRequest(
        @NotBlank
        @Size(min = 3, max = 100)
        String name,
        String description) {
}
