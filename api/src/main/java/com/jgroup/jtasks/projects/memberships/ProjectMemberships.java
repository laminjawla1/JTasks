package com.jgroup.jtasks.projects.memberships;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.commons.MembershipStatus;
import com.jgroup.jtasks.projects.projects.Project;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.workspaces.workspaces.Workspace;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "project_memberships")
public class ProjectMemberships extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @Enumerated(EnumType.STRING)
    private MembershipStatus membershipStatus;
}
