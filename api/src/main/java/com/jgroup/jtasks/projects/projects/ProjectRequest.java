package com.jgroup.jtasks.projects.projects;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectRequest(

        @NotBlank
        @Size(min = 3, max = 100)
        String name,

        @NotNull
        UUID leadId,

        @NotNull
        @FutureOrPresent
        LocalDate startDate,

        @FutureOrPresent
        LocalDate endDate
) {}
