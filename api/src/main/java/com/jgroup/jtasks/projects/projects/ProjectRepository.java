package com.jgroup.jtasks.projects.projects;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    @Query("""
        SELECT project FROM Project project
        LEFT JOIN FETCH project.workspace workspace
        LEFT JOIN FETCH project.members m
        WHERE project.id = :projectId
        AND workspace.slug = :slug AND m.id = :userId
    """)
    Optional<Project> findByIdWorkspaceSlugAndUserId(UUID projectId, String slug, UUID userId);
}
