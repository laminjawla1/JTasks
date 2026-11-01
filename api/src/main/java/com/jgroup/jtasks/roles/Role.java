package com.jgroup.jtasks.roles;

import com.jgroup.jtasks.commons.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "roles")
public class Role extends BaseEntity {
    private String name;
}
