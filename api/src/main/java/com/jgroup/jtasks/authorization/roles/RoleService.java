package com.jgroup.jtasks.authorization.roles;

import com.jgroup.jtasks.authorization.privileges.Privilege;
import com.jgroup.jtasks.authorization.privileges.PrivilegeRepository;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.workspaces.repositories.WorkspaceRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final WorkspaceRepository workspaceRepository;
    private final PrivilegeRepository privilegeRepository;

    @Transactional
    public RoleResponse create(User currentUser, UUID workspaceId, RoleRequest request) {
        if (roleRepository.existsByNameAndWorkspaceId(request.name(), workspaceId)) {
            throw new EntityExistsException("Role already exists");
        }

        var workspace = workspaceRepository.findByUserAndId(currentUser.getId(), workspaceId)
                .orElseThrow(() -> new EntityNotFoundException("Workspace not found"));

        List<Privilege> privileges = privilegeRepository.findAllById(request.privilegeIds());

        if (privileges.isEmpty()) {
            throw new EntityNotFoundException("No privileges matches the given ids");
        }

        var role = new Role();
        role.setName(request.name());
        role.setPrivileges(new HashSet<>(privileges));
        role.setWorkspace(workspace);

        return roleRepository.save(role).response();
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> getAll(User currentUser, UUID workspaceId) {
        return roleRepository.findAllByUserAndWorkspace(currentUser.getId(), workspaceId)
                .stream().map(Role::response).toList();
    }

    @Transactional(readOnly = true)
    public RoleResponse get(User currentUser, UUID workspaceId, UUID roleId) {
        return roleRepository.findByUserWorkspaceAndId(currentUser.getId(), workspaceId, roleId)
                .orElseThrow(() -> new EntityNotFoundException("Role not found"))
                .response();
    }

    @Transactional
    public RoleResponse update(User currentUser, UUID workspaceId, UUID roleId, @Valid RoleRequest request) {
        Role role = roleRepository.findByUserWorkspaceAndId(currentUser.getId(), workspaceId, roleId)
                .orElseThrow(() -> new EntityNotFoundException("Workspace not found"));

        if (roleRepository.existsByNameAndWorkspaceId(request.name(), workspaceId) && !role.getName().equals(request.name())) {
            throw new EntityExistsException("Role already exists");
        }

        List<Privilege> privileges = privilegeRepository.findAllById(request.privilegeIds());

        if (privileges.isEmpty()) {
            throw new EntityNotFoundException("No privileges matches the given ids");
        }

        role.setName(request.name());
        role.setPrivileges(new HashSet<>(privileges));
        return roleRepository.save(role).response();
    }

    @Transactional
    public void delete(User currentUser, UUID workspaceId, UUID roleId) {
        Role role = roleRepository.findByUserWorkspaceAndId(currentUser.getId(), workspaceId, roleId)
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));
        roleRepository.delete(role);
    }
}
