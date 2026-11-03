package com.jgroup.jtasks.projects;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.workspaces.Workspace;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name="projects")
@EqualsAndHashCode(callSuper = true)
public class Project extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @Enumerated(EnumType.STRING)
    private Status status;
}
