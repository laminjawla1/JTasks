package com.jgroup.jtasks.projects.boards;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.projects.projects.Project;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "boards")
public class Board extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private String name;

    @Column(name = "board_order")
    private Float order;
}
