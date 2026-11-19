package com.jgroup.jtasks.workspaces.memberships;

import com.jgroup.jtasks.commons.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkspaceMembersRepository extends JpaRepository<WorkspaceMembership, UUID> {
    Optional<WorkspaceMembership> findByUserIdAndWorkspaceId(UUID userId, UUID workspaceId);

    @Query("""
        SELECT membership FROM WorkspaceMembership membership
        LEFT JOIN FETCH membership.user user
        WHERE user.id = :userId AND membership.status = :status
    """)
    List<WorkspaceMembership> findAllByUserIdAndStatusEquals(UUID userId, MembershipStatus status);
}
