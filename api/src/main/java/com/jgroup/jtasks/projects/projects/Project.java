package com.jgroup.jtasks.projects.projects;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.workspaces.workspaces.Workspace;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

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

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "project_members",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    private Set<User> members = new HashSet<>();

    public ProjectResponse response() {
        return new ProjectResponse(
            getId(), name, workspace.response(), lead.response(), status, startDate, endDate
        );
    }

    public void addMember(User user) {
        this.members.add(user);
        user.getProjects().add(this);
    }

    public void removeMember(User user) {
        this.members.remove(user);
        user.getProjects().remove(this);
    }
}
