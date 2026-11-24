package com.jgroup.jtasks.projects.controllers;

import com.jgroup.jtasks.projects.dto.ProjectRequest;
import com.jgroup.jtasks.projects.dto.ProjectResponse;
import com.jgroup.jtasks.projects.dto.ProjectUpdate;
import com.jgroup.jtasks.projects.services.ProjectService;
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
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAll(
            @AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId) {
        return ResponseEntity.ok(projectService.getAll(currentUser, workspaceId));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.create(currentUser, workspaceId, request));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> get(@AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId, @PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.get(currentUser, workspaceId, projectId));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> update(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID workspaceId,
            @PathVariable UUID projectId,
            @Valid @RequestBody ProjectUpdate request) {
        return ResponseEntity.ok(projectService.update(currentUser, workspaceId, projectId, request));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId, @PathVariable UUID projectId) {
        projectService.delete(currentUser, workspaceId, projectId);
        return ResponseEntity.noContent().build();
    }
}
