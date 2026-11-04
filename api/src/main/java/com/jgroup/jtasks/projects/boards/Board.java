package com.jgroup.jtasks.projects.boards;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.projects.projects.Project;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "boards")
@EqualsAndHashCode(callSuper = true)
public class Board extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private String name;

    @Column(name = "board_order")
    private Float order;
}
