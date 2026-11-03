package com.jgroup.jtasks.roles;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.memberships.Membership;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "roles")
@EqualsAndHashCode(callSuper = true)
public class Role extends BaseEntity {
    private String name;

    @ManyToMany(mappedBy = "roles")
    private Set<Membership> memberships = new HashSet<>();
}
