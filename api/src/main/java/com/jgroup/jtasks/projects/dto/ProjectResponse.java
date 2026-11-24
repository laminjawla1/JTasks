package com.jgroup.jtasks.projects.dto;

import com.jgroup.jtasks.projects.enums.ProjectStatus;
import com.jgroup.jtasks.projects.enums.ProjectVisibility;
import com.jgroup.jtasks.users.UserResponse;
import com.jgroup.jtasks.workspaces.dto.WorkspaceResponse;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        String name,
        WorkspaceResponse workspace,
        UserResponse user,
        ProjectStatus projectStatus,
        ProjectVisibility visibility,
        LocalDate startDate,
        LocalDate endDate) {
}
