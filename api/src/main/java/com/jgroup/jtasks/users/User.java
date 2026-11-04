package com.jgroup.jtasks.users;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.projects.tasks.Task;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "users")
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToMany(mappedBy = "assignees", fetch = FetchType.LAZY)
    private Set<Task> tasks = new HashSet<>();
}
