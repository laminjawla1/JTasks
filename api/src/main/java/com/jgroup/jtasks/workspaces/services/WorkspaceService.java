package com.jgroup.jtasks.workspaces.services;

import com.jgroup.jtasks.auditlogs.AuditLogResponse;
import com.jgroup.jtasks.authorization.privileges.PrivilegeRepository;
import com.jgroup.jtasks.authorization.roles.*;
import com.jgroup.jtasks.commons.MembershipStatus;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.users.UserRepository;
import com.jgroup.jtasks.workspaces.dto.WorkspaceMemberResponse;
import com.jgroup.jtasks.workspaces.dto.WorkspaceSettingResponse;
import com.jgroup.jtasks.workspaces.enums.WorkspaceStatus;
import com.jgroup.jtasks.workspaces.domains.Workspace;
import com.jgroup.jtasks.workspaces.dto.WorkspaceRequest;
import com.jgroup.jtasks.workspaces.dto.WorkspaceResponse;
import com.jgroup.jtasks.workspaces.repositories.WorkspaceMemberRepository;
import com.jgroup.jtasks.workspaces.domains.WorkspaceMember;
import com.jgroup.jtasks.workspaces.repositories.WorkspaceRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PrivilegeRepository privilegeRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    @Transactional
    public WorkspaceResponse create(User currentUser, WorkspaceRequest request) {
        log.info("Creating workspace '{}' for user {}", request.name(), currentUser.getId());

        if (workspaceRepository.existsByName(request.name())) {
            throw new EntityExistsException("Workspace name already taken");
        }

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Workspace workspace = new Workspace();
        workspace.setName(request.name());
        workspace.setDescription(request.description());
        workspace.setSlug(slugify(request.name()));
        workspace.setStatus(WorkspaceStatus.ACTIVE);
        workspace = workspaceRepository.save(workspace);

        WorkspaceMember member = new WorkspaceMember();
        member.setUser(user);
        member.setWorkspace(workspace);
        member.setStatus(MembershipStatus.ACTIVE);
        member = workspaceMemberRepository.save(member);

        workspace.getMembers().add(member);

        seedDefaultWorkspaceRoles(workspace);

        Role role = roleRepository.findByNameAndWorkspaceId(DefaultRole.OWNER.name(), workspace.getId())
                .orElseThrow(() -> new EntityNotFoundException("OWNER role not found"));

        member.addRole(role);
        workspace = workspaceRepository.save(workspace);

        log.info("Workspace '{}' created successfully. Workspace ID: {}",
                workspace.getName(), workspace.getId());
        return workspace.response();
    }

    @Transactional
    private void seedDefaultWorkspaceRoles(Workspace workspace) {
        log.info("Seeding default roles for workspace: {}", workspace.getId());

        List<Role> roles = new ArrayList<>();
        for (DefaultRole defaultRole : DefaultRole.values()) {
            log.info("Creating workspace role: {}", defaultRole);

            Role role = new Role();
            role.setWorkspace(workspace);
            role.setName(defaultRole.name());
            role.setSystemRole(defaultRole.isSystemRole());
            role.setPrivileges(privilegeRepository.findAllByNameIn(defaultRole.getPrivileges()));
            roles.add(role);
            log.info("Done seeding: {}", role);
        }
        roleRepository.saveAll(roles);
        log.info("Seeded {} default roles for workspace {}", roles.size(), workspace.getId());
    }

    private String slugify(String name) {
        return name.toLowerCase().replaceAll("\\s", "-");
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getAll(User currentUser) {
        var user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return user.getMemberships().stream()
                .map(WorkspaceMember::getWorkspace)
                .map(Workspace::response).toList();
    }

    @Transactional
    public WorkspaceResponse update(User currentUser, @Valid WorkspaceRequest request, UUID workspaceId) {
        var workspace = workspaceRepository.findByUserAndId(currentUser.getId(), workspaceId)
                .orElseThrow(() -> new EntityNotFoundException("Workspace not found"));

        if (workspaceRepository.existsByName(request.name()) && !workspace.getName().equalsIgnoreCase(request.name())) {
            throw new EntityExistsException("Workspace name already taken");
        }
        workspace.setName(request.name());
        workspace.setSlug(slugify(request.name()));
        workspace.setDescription(request.description());
        return workspaceRepository.save(workspace).response();
    }

    @Transactional
    public void delete(User currentUser, UUID workspaceId) {
        var workspace = workspaceRepository.findByUserAndId(currentUser.getId(), workspaceId)
                .orElseThrow(() -> new EntityNotFoundException("Workspace not found"));
        workspaceRepository.delete(workspace);
    }

    @Transactional(readOnly = true)
    public WorkspaceResponse get(User currentUser, UUID workspaceId) {
        return workspaceRepository.findByUserAndId(currentUser.getId(), workspaceId)
                .orElseThrow(() -> new EntityNotFoundException("Workspace not found"))
                .response();
    }

    @Transactional(readOnly = true)
    public List<WorkspaceMemberResponse> getMembers(User currentUser, UUID workspaceId) {
        var user = userRepository.findById(currentUser.getId()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        workspaceMemberRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId)
                .orElseThrow(() -> new AccessDeniedException("You are not authorised to view this workspace"));
        return workspaceMemberRepository.findAllByWorkspaceId(workspaceId, MembershipStatus.ACTIVE)
                .stream().map(WorkspaceMember::response).toList();
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogs(User currentUser, UUID workspaceId) {
        return List.of(new AuditLogResponse());
    }

    public List<WorkspaceSettingResponse> getSettings(User currentUser, UUID workspaceId) {
        return List.of(new WorkspaceSettingResponse());
    }
}
