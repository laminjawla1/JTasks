package com.jgroup.jtasks.users;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
}
