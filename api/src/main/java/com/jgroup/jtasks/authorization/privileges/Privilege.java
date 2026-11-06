package com.jgroup.jtasks.authorization.privileges;

import com.jgroup.jtasks.commons.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "privileges")
public class Privilege extends BaseEntity {
    @Enumerated(EnumType.STRING)
    private Privileges name;

    public Privilege(Privileges name) { this.name = name; }
}
