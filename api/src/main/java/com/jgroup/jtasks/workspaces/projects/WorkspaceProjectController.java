package com.jgroup.jtasks.workspaces.projects;

import com.jgroup.jtasks.projects.projects.ProjectRequest;
import com.jgroup.jtasks.projects.projects.ProjectResponse;
import com.jgroup.jtasks.projects.projects.ProjectService;
import com.jgroup.jtasks.users.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workspaces/{workspaceId}/projects")
public class WorkspaceProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId) {
        return ResponseEntity.ok(projectService.getAll(currentUser, workspaceId));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(currentUser, workspaceId, request));
    }
}
