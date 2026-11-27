package com.jgroup.jtasks.authorization.roles;

import com.jgroup.jtasks.authorization.privileges.Privilege;
import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.workspaces.domains.WorkspaceMember;
import com.jgroup.jtasks.workspaces.domains.Workspace;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "roles")
public class Role extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    private Boolean systemRole;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(
            name = "role_privileges",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "privilege_id")
    )
    private Set<Privilege> privileges = new HashSet<>();

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<WorkspaceMember> members = new HashSet<>();

    public RoleResponse response() {
        return new RoleResponse(getId(), name, systemRole, getCreatedAt(), getUpdatedAt());
    }
}
