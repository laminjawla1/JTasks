package com.jgroup.jtasks.workspaces.members;

import com.jgroup.jtasks.commons.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, UUID> {
    Optional<WorkspaceMember> findByUserIdAndWorkspaceId(UUID userId, UUID workspaceId);

    @Query("""
        SELECT membership FROM WorkspaceMember membership
        LEFT JOIN FETCH membership.user user
        WHERE user.id = :userId AND membership.status = :status
    """)
    List<WorkspaceMember> findAllByUserIdAndStatusEquals(UUID userId, MembershipStatus status);

    @Query("""
        SELECT membership FROM WorkspaceMember membership
        LEFT JOIN FETCH membership.workspace workspace
        WHERE workspace.id = :workspaceId AND membership.status = :status
    """)
    List<WorkspaceMember> findAllByWorkspaceId(UUID workspaceId, MembershipStatus status);
}
