package com.jgroup.jtasks.users;

import com.jgroup.jtasks.authorization.roles.Role;
import com.jgroup.jtasks.commons.MembershipStatus;
import com.jgroup.jtasks.jwt.JwtService;
import com.jgroup.jtasks.workspaces.members.WorkspaceMemberRepository;
import com.jgroup.jtasks.workspaces.members.WorkspaceMember;
import com.jgroup.jtasks.workspaces.members.WorkspaceMemberResponse;
import com.jgroup.jtasks.workspaces.workspaces.WorkspaceRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WorkspaceRepository workspaceRepository;
    private final AuthenticationManager authenticationManager;
    private final WorkspaceMemberRepository workspaceMemberRepository;

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
        return user.response();
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

    @Transactional(readOnly = true)
    public Authorities getAuthorities(UUID userId, String workspaceSlug) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        var workspace = workspaceRepository.findBySlug(workspaceSlug)
                .orElseThrow(() -> new EntityNotFoundException("Workspace not found"));

        var membership = workspaceMemberRepository.findByUserIdAndWorkspaceId(user.getId(), workspace.getId())
                .orElseThrow(() -> new AccessDeniedException("You are not authorized to view this workspace."));

        var roles = membership.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        var privileges = new HashSet<String>();
        for (var role : membership.getRoles()) {
            privileges.addAll(role.getPrivileges().stream().map(p -> p.getName().name()).collect(Collectors.toSet()));
        }
        return new Authorities(roles, privileges);
    }

    @Transactional(readOnly = true)
    public List<WorkspaceMemberResponse> getMemberships(User currentUser, UUID userId) {
        if (!currentUser.getId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to view these sets of workspaces");
        }
        var memberships = workspaceMemberRepository.findAllByUserIdAndStatusEquals(userId, MembershipStatus.ACTIVE);
        return memberships.stream().map(WorkspaceMember::response).toList();
    }
}
