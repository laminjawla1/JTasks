package com.jgroup.jtasks.workspaces.memberships;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.commons.MembershipStatus;
import com.jgroup.jtasks.authorization.roles.Role;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.workspaces.workspaces.Workspace;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "workspace_memberships")
public class WorkspaceMembership extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "workspace_membership_roles",
            joinColumns = @JoinColumn(name = "membership_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private MembershipStatus status;

    public void addRole(Role role) {
        this.roles.add(role);
        role.getMembers().add(this);
    }

    public void removeRole(Role role) {
        this.roles.remove(role);
        role.getMembers().remove(this);
    }
}
