package com.jgroup.jtasks.workspaces.repositories;

import com.jgroup.jtasks.workspaces.domains.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
    boolean existsByName(String name);

    Optional<Workspace> findBySlug(String workspaceSlug);

    @Query("""
        SELECT workspace FROM Workspace workspace
        LEFT JOIN FETCH workspace.members member
        WHERE member.id = :id
    """)
    List<Workspace> findAllByUser(UUID id);

    @Query("""
        SELECT workspace FROM Workspace workspace
        LEFT JOIN FETCH workspace.members member
        WHERE member.user.id = :userId
            AND workspace.id = :workspaceId
    """)
    Optional<Workspace> findByUserAndId(UUID userId, UUID workspaceId);
}
