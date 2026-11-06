package com.jgroup.jtasks.projects.projects;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.workspaces.workspaces.Workspace;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name="projects")
public class Project extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private User lead;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;
}
