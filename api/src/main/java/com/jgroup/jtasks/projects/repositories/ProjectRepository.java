package com.jgroup.jtasks.projects.repositories;

import com.jgroup.jtasks.projects.domains.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    @Query("""
        SELECT project FROM Project project
        LEFT JOIN FETCH project.workspace workspace
        LEFT JOIN FETCH project.members member
        WHERE workspace.id = :workspaceId
        AND member.id = :memberId
    """)
    List<Project> findAllByWorkspaceAndMember(UUID workspaceId, UUID memberId);

    @Query("""
        SELECT project FROM Project project
        LEFT JOIN FETCH project.workspace workspace
        LEFT JOIN FETCH workspace.members member
        WHERE workspace.id = :workspaceId AND
        project.id = :projectId AND
        member.user.id = :userId
    """)
    Optional<Project> findByUserWorkspaceAndId(UUID userId, UUID workspaceId, UUID projectId);
}
