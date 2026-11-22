package com.jgroup.jtasks.projects.repositories;

import com.jgroup.jtasks.projects.domains.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BoardRepository extends JpaRepository<Board, UUID> {
    @Query("""
        SELECT board FROM Board board
        LEFT JOIN FETCH board.project project
        LEFT JOIN FETCH project.workspace workspace
        LEFT JOIN FETCH workspace.members member
        WHERE project.id = :projectId
            AND workspace.id = :workspaceId
                AND member.user.id = :id
    """)
    List<Board> findByUserWorkspaceAndProject(UUID id, UUID workspaceId, UUID projectId);
}
