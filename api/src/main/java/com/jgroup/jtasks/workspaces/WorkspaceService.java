package com.jgroup.jtasks.workspaces;

import com.jgroup.jtasks.memberships.Membership;
import com.jgroup.jtasks.projects.boards.Board;
import com.jgroup.jtasks.projects.projects.Project;
import com.jgroup.jtasks.projects.projects.ProjectRepository;
import com.jgroup.jtasks.roles.Role;
import com.jgroup.jtasks.roles.RoleRepository;
import com.jgroup.jtasks.roles.Roles;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.users.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;

    @Transactional
    public WorkspaceResponse createWorkspace(UUID id, WorkspaceRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Role role = roleRepository.findByName(Roles.OWNER).orElseThrow(() -> new EntityNotFoundException("OWNER role not found"));

        Workspace workspace = new Workspace();
        workspace.setName(request.name());
        workspace.setStatus(Status.ACTIVE);

        Project project = new Project();
        project.setName("Default");
        project.setWorkspace(workspace);
        project.setLead(user);
        project.setStatus(com.jgroup.jtasks.projects.projects.Status.PENDING);
        project.setStartDate(LocalDate.now());
        project = projectRepository.save(project);

        Board todo = new Board();
        todo.setName("TODO");
        todo.setProject(project);
        todo.setOrder(1.0F);

        Board progress = new Board();
        progress.setName("In Progress");
        progress.setProject(project);
        progress.setOrder(2.0F);

        Board done = new Board();
        done.setName("Done");
        done.setProject(project);
        done.setOrder(3.0F);

        Membership membership = new Membership();
        membership.setUser(user);
        membership.setProject(project);
        membership.setWorkspace(workspace);
        membership.addRole(role);
        membership.setStatus(com.jgroup.jtasks.memberships.Status.ACTIVE);
        return workspaceRepository.save(workspace).response();
    }
}
