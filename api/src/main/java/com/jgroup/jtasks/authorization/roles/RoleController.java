package com.jgroup.jtasks.authorization.roles;

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
@RequestMapping("/workspaces/{workspaceId}/roles")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAll(@AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId) {
        return ResponseEntity.ok(roleService.getAll(currentUser, workspaceId));
    }

    @PostMapping
    public ResponseEntity<RoleResponse> create(
            @AuthenticationPrincipal User currentUser, @PathVariable UUID workspaceId, @Valid @RequestBody RoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roleService.create(currentUser, workspaceId, request));
    }

    @GetMapping("/{roleId}")
    public ResponseEntity<RoleResponse> get(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID workspaceId,
            @PathVariable UUID roleId) {
        return ResponseEntity.ok(roleService.get(currentUser, workspaceId, roleId));
    }

    @PutMapping("/{roleId}")
    public ResponseEntity<RoleResponse> update(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID workspaceId,
            @PathVariable UUID roleId,
            @Valid @RequestBody RoleRequest request) {
        return ResponseEntity.ok(roleService.update(currentUser, workspaceId, roleId, request));
    }

    @DeleteMapping("/{roleId}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID workspaceId,
            @PathVariable UUID roleId) {
        roleService.delete(currentUser, workspaceId, roleId);
        return ResponseEntity.noContent().build();
    }
}
