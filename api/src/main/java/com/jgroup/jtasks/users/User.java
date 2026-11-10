package com.jgroup.jtasks.users;

import com.jgroup.jtasks.commons.BaseEntity;
import com.jgroup.jtasks.projects.projects.Project;
import com.jgroup.jtasks.projects.tasks.Task;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User extends BaseEntity implements UserDetails {

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

    @ManyToMany(mappedBy = "members", fetch = FetchType.LAZY)
    private Set<Project> projects;

    public UserResponse response() {
        return new UserResponse(getId(), firstName, lastName, email, status, getCreatedAt(), getUpdatedAt());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    @SuppressWarnings("NullableProblems")
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
