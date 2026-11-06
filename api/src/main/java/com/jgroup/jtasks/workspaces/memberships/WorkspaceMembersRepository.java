package com.jgroup.jtasks.workspaces.memberships;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WorkspaceMembersRepository extends JpaRepository<WorkspaceMembership, UUID> {
}
