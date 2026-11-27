package com.jgroup.jtasks.authorization.roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    boolean existsByNameAndWorkspaceId(String name, UUID workspaceId);


    @Query("""
        SELECT role FROM Role role
        LEFT JOIN FETCH role.workspace workspace
        LEFT JOIN FETCH workspace.members member
        WHERE workspace.id = :workspaceId AND member.user.id = :userId
    """)
    List<Role> findAllByUserAndWorkspace(UUID userId, UUID workspaceId);

    Optional<Role> findByNameAndWorkspaceId(String name, UUID workspaceId);
}
