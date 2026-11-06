package com.jgroup.jtasks.workspaces.workspaces;

import com.jgroup.jtasks.commons.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="workspaces")
public class Workspace extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    private Status status;

    public WorkspaceResponse response() {
        return new WorkspaceResponse(getId(), name, slug, status, getCreatedAt(), getUpdatedAt());
    }
}
