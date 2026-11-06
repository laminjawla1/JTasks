package com.jgroup.jtasks.projects.memberships;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectMembershipRepository extends JpaRepository<ProjectMemberships, UUID> {
}
