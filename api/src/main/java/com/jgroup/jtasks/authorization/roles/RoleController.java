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

}
