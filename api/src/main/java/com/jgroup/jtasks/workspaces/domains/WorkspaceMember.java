package com.jgroup.jtasks.workspaces.domains;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.commons.MembershipStatus;
import com.jgroup.jtasks.authorization.roles.Role;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.workspaces.dto.WorkspaceMemberResponse;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "workspace_members")
public class WorkspaceMember extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "workspace_member_roles",
            joinColumns = @JoinColumn(name = "workspace_member_id"),
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

    public WorkspaceMemberResponse response() {
        return new WorkspaceMemberResponse(
                getId(),
                user.response(),
                workspace.response(),
                roles.stream().map(Role::response).toList(),
                status,
                getCreatedAt(),
                getUpdatedAt()
        );
    }
}
