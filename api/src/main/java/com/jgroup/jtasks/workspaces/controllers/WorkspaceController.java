package com.jgroup.jtasks.workspaces.controllers;

import com.jgroup.jtasks.auditlogs.AuditLogResponse;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.workspaces.dto.WorkspaceMemberResponse;
import com.jgroup.jtasks.workspaces.dto.WorkspaceRequest;
import com.jgroup.jtasks.workspaces.dto.WorkspaceResponse;
import com.jgroup.jtasks.workspaces.dto.WorkspaceSettingResponse;
import com.jgroup.jtasks.workspaces.services.WorkspaceService;
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
@RequestMapping("/workspaces")
public class WorkspaceController {
    private final WorkspaceService workspaceService;

    @GetMapping
    public ResponseEntity<List<WorkspaceResponse>> getAll(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(workspaceService.getAll(currentUser));
    }

    @PostMapping
    public ResponseEntity<WorkspaceResponse> create(
            @AuthenticationPrincipal User user, @Valid @RequestBody WorkspaceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workspaceService.create(user, request));
    }

    @GetMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceResponse> get(@AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId) {
        return ResponseEntity.ok(workspaceService.get(currentUser, workspaceId));
    }

    @PutMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceResponse> update(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody WorkspaceRequest request,
            @PathVariable UUID workspaceId
    ) {
        return ResponseEntity.ok(workspaceService.update(currentUser, request, workspaceId));
    }

    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId) {
        workspaceService.delete(currentUser, workspaceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{workspaceId}/members")
    public ResponseEntity<List<WorkspaceMemberResponse>> getMembers(@AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId) {
        return ResponseEntity.ok(workspaceService.getMembers(currentUser, workspaceId));
    }

    @GetMapping("/{workspaceId}/audit-logs")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs(@AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId) {
        return ResponseEntity.ok(workspaceService.getAuditLogs(currentUser, workspaceId));
    }

    @GetMapping("/{workspaceId}/settings")
    public ResponseEntity<List<WorkspaceSettingResponse>> getSettings(@AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId) {
        return ResponseEntity.ok(workspaceService.getSettings(currentUser, workspaceId));
    }
}
