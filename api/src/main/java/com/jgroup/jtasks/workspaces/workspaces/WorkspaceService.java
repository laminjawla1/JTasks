package com.jgroup.jtasks.workspaces.workspaces;

import com.github.slugify.Slugify;
import com.jgroup.jtasks.authorization.privileges.PrivilegeRepository;
import com.jgroup.jtasks.authorization.roles.DefaultRole;
import com.jgroup.jtasks.authorization.roles.Role;
import com.jgroup.jtasks.authorization.roles.RoleRepository;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.users.UserRepository;
import com.jgroup.jtasks.workspaces.memberships.WorkspaceMembership;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final Slugify slugify;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PrivilegeRepository privilegeRepository;
    private final WorkspaceRepository workspaceRepository;

    @Transactional
    public WorkspaceResponse createWorkspace(UUID id, WorkspaceRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Workspace workspace = new Workspace();
        workspace.setName(request.name());
        workspace.setSlug(slugify.slugify(request.name()));
        workspace.setStatus(Status.ACTIVE);
        workspace = workspaceRepository.save(workspace);

        Role role = roleRepository.findByNameAndWorkspaceId(DefaultRole.SUPER_ADMIN.name(), workspace.getId())
                .orElse(new Role(DefaultRole.SUPER_ADMIN.name()));
        role.setWorkspace(workspace);
        role.setPrivileges(new HashSet<>(privilegeRepository.findAll()));
        role = roleRepository.save(role);

        WorkspaceMembership membership = new WorkspaceMembership();
        membership.setUser(user);
        membership.setWorkspace(workspace);
        membership.addRole(role);
        return workspaceRepository.save(workspace).response();
    }
}
