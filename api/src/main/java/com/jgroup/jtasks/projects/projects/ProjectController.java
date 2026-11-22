package com.jgroup.jtasks.projects.projects;

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
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;



    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
        @AuthenticationPrincipal User currentUser, @PathVariable String workspaceSlug, @PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.getProject(currentUser, workspaceSlug, projectId));
    }
}
