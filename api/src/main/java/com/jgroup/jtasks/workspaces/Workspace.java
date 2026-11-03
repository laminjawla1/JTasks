package com.jgroup.jtasks.workspaces;

import com.jgroup.jtasks.commons.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@Table(name="workspaces")
@EqualsAndHashCode(callSuper = true)
public class Workspace extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    private Status status;
}
