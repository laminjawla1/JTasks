package com.jgroup.jtasks.users;

import com.jgroup.jtasks.workspaces.members.WorkspaceMemberResponse;
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
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> profile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.profile(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@AuthenticationPrincipal User user, @Valid @RequestBody UserUpdate request) {
        return ResponseEntity.ok(userService.update(user.getId(), request));
    }

    @GetMapping("/{userId}/memberships")
    public ResponseEntity<List<WorkspaceMemberResponse>> getMemberships(@AuthenticationPrincipal User currentUser, @PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getMemberships(currentUser, userId));
    }

    @GetMapping("/{userId}/workspaces/{workspaceSlug}")
    public ResponseEntity<Authorities> getAuthorities(@PathVariable UUID userId, @PathVariable String workspaceSlug) {
        return ResponseEntity.ok(userService.getAuthorities(userId, workspaceSlug));
    }

}
