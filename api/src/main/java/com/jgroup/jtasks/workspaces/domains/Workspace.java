package com.jgroup.jtasks.workspaces.domains;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.workspaces.enums.WorkspaceStatus;
import com.jgroup.jtasks.workspaces.dto.WorkspaceResponse;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name="workspaces")
public class Workspace extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    private WorkspaceStatus status;

    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<WorkspaceMember> members = new HashSet<>();

    public WorkspaceResponse response() {
        return new WorkspaceResponse(getId(), name, description, slug, status, getCreatedAt(), getUpdatedAt());
    }
}
