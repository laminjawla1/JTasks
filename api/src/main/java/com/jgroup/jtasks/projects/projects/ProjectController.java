package com.jgroup.jtasks.projects.projects;

import com.jgroup.jtasks.users.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/{workspaceSlug}/projects")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String workspaceSlug,
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(currentUser, workspaceSlug, request));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
        @AuthenticationPrincipal User currentUser, @PathVariable String workspaceSlug, @PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.getProject(currentUser, workspaceSlug, projectId));
    }
}
