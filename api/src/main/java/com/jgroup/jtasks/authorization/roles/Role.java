package com.jgroup.jtasks.authorization.roles;

import com.jgroup.jtasks.authorization.privileges.Privilege;
import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.workspaces.memberships.WorkspaceMembership;
import com.jgroup.jtasks.workspaces.workspaces.Workspace;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "roles")
public class Role extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE, CascadeType.REFRESH })
    @JoinTable(name = "role_privileges", joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "privilege_id"))
    private Set<Privilege> privileges = new HashSet<>();

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<WorkspaceMembership> members = new HashSet<>();

    public Role(String name) {
        this.name = name;
    }
}
