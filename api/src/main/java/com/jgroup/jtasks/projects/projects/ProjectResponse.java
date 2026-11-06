package com.jgroup.jtasks.projects.projects;

import com.jgroup.jtasks.users.UserResponse;
import com.jgroup.jtasks.workspaces.workspaces.WorkspaceResponse;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectResponse(UUID id, String name, WorkspaceResponse response, UserResponse response1, Status status, LocalDate startDate, LocalDate endDate) {
}
