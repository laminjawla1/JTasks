package com.jgroup.jtasks.memberships;

import com.jgroup.jtasks.roles.Role;
import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.projects.projects.Project;
import com.jgroup.jtasks.workspaces.Workspace;
import com.jgroup.jtasks.users.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "memberships")
@EqualsAndHashCode(callSuper = true)
public class Membership extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "membership_roles",
            joinColumns = @JoinColumn(name = "membership_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private Status status;

    public void addRole(Role role) {
        this.roles.add(role);
        role.getMemberships().add(this);
    }

    public void removeRole(Role role) {
        this.roles.remove(role);
        role.getMemberships().remove(this);
    }
}
