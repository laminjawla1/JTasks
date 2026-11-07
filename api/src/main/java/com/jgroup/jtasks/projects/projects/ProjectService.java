package com.jgroup.jtasks.projects.projects;

import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.users.UserRepository;
import com.jgroup.jtasks.workspaces.memberships.WorkspaceMembersRepository;
import com.jgroup.jtasks.workspaces.workspaces.Workspace;
import com.jgroup.jtasks.workspaces.workspaces.WorkspaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMembersRepository workspaceMembersRepository;

    @Transactional
    public ProjectResponse createProject(User currentUser, String workspaceSlug, ProjectRequest request) {
        User user = userRepository
                .findById(currentUser.getId()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Workspace workspace = workspaceRepository
                .findBySlug(workspaceSlug).orElseThrow(() -> new EntityNotFoundException("Workspace does not exist"));

        workspaceMembersRepository
                .findByUserIdAndWorkspaceId(user.getId(), workspace.getId())
                .orElseThrow(() -> new AccessDeniedException("You are not authorized to view this workspace."));

        User lead = userRepository
                .findById(request.leadId()).orElseThrow(() -> new EntityNotFoundException("Lead not a registered user"));

        Project project = new Project();
        project.setName(request.name());
        project.setWorkspace(workspace);
        project.setLead(lead);
        project.setStatus(Status.PENDING);
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.addMember(user);
        project.addMember(lead);
        project = projectRepository.save(project);
        return projectRepository.save(project).response();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(User user, String workspaceSlug, UUID projectId) {
        return projectRepository.findByIdWorkspaceSlugAndUserId(projectId, workspaceSlug, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found")).response();
    }
}
