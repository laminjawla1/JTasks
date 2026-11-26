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
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

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
        if (workspaceRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Workspace already exists");
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

        Role role = roleRepository.findByName(DefaultRole.OWNER.name())
                .orElseThrow(() -> new EntityNotFoundException("Owner role not found"));

        member.addRole(role);
        return workspaceRepository.save(workspace).response();
    }

    private void seedDefaultWorkspaceRoles(Workspace workspace) {
        for (DefaultRole role : DefaultRole.values()) {
            Role obj = roleRepository.findByName(role.name()).orElseGet(Role::new);
            obj.setWorkspace(workspace);
            obj.setName(role.name());
            obj.setPrivileges(privilegeRepository.findAllByNameIn(role.getPrivileges()));
        }
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
