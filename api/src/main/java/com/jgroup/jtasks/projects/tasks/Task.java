package com.jgroup.jtasks.projects.tasks;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.projects.boards.Board;
import com.jgroup.jtasks.projects.projects.Project;
import com.jgroup.jtasks.users.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name="tasks")
public class Task extends BaseEntity {

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "task_assignees",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "assignee_id")
    )
    private Set<User> assignees;

    private LocalDateTime assignedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private String summary;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "task_order")
    private Float order;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.TODO;
}
