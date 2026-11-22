package com.jgroup.jtasks.authorization.roles;

import com.jgroup.jtasks.authorization.privileges.Privilege;
import com.jgroup.jtasks.authorization.privileges.PrivilegeRepository;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.workspaces.WorkspaceRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
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
    public RoleResponse createRole(User currentUser, UUID workspaceId, RoleRequest request) {
        if (!roleRepository.existsByNameAndWorkspaceId(request.name(), workspaceId)) {
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
}
