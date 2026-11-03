package com.jgroup.jtasks.users;

import com.jgroup.jtasks.authorization.privileges.Privilege;
import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.roles.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Entity
@Table(name = "users")
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity implements UserDetails {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> roles = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private Status status;

    @Override
    @SuppressWarnings("NullableProblems")
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        for (Role role : roles) {
            Set<String> privileges = role.getPrivileges().stream().map(Privilege::getName).collect(Collectors.toSet());
            authorities.addAll(privileges.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet()));
        }
        return authorities;
    }
}
