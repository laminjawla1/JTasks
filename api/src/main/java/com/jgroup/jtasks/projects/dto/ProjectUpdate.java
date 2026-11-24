package com.jgroup.jtasks.projects.dto;

import com.jgroup.jtasks.projects.enums.ProjectStatus;
import com.jgroup.jtasks.projects.enums.ProjectVisibility;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectUpdate(

        @NotBlank
        @Size(min = 3, max = 100)
        String name,

        @NotNull
        UUID leadId,

        @NotNull
        @FutureOrPresent
        LocalDate startDate,

        @FutureOrPresent
        LocalDate endDate,

        @NotNull
        ProjectVisibility visibility,

        @NotNull
        ProjectStatus status
) {}
