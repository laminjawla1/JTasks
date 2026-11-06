package com.jgroup.jtasks.users;

import com.jgroup.jtasks.jwt.JwtService;
import com.jgroup.jtasks.workspaces.workspaces.WorkspaceRequest;
import com.jgroup.jtasks.workspaces.workspaces.WorkspaceService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UserService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WorkspaceService workspaceService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EntityExistsException("User with this email already exist");
        }
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setStatus(Status.ACTIVE);
        user = userRepository.save(user);
        var workspace = workspaceService.createWorkspace(user.getId(), new WorkspaceRequest(request.workspaceName()));
        return user.response(workspace);
    }

    public LoginResponse login(@Valid LoginRequest req) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.password())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            User user = (User) authentication.getPrincipal();

            assert user != null;

            String jwt = jwtService.generate(user);
            return new LoginResponse(jwt, user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
        } catch (BadCredentialsException _) {
            throw new SecurityException("Invalid email or password");
        }
    }

    @Transactional(readOnly = true)
    public UserResponse profile(User user) {
        return userRepository
                .findById(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"))
                .response();
    }

    @Transactional
    public UserResponse update(UUID id, UserUpdate request) {
        var user = userRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        return userRepository.save(user).response();
    }
}
