package com.jgroup.jtasks.projects.projects;

import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.users.UserRepository;
import com.jgroup.jtasks.workspaces.members.WorkspaceMemberRepository;
import com.jgroup.jtasks.workspaces.Workspace;
import com.jgroup.jtasks.workspaces.WorkspaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    @Transactional
    public ProjectResponse createProject(User currentUser, UUID workspaceId, ProjectRequest request) {
        User user = userRepository
                .findById(currentUser.getId()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Workspace workspace = workspaceRepository
                .findById(workspaceId).orElseThrow(() -> new EntityNotFoundException("Workspace does not exist"));

        workspaceMemberRepository
                .findByUserIdAndWorkspaceId(user.getId(), workspace.getId())
                .orElseThrow(() -> new AccessDeniedException("You are not authorized to view this workspace."));

        var member = workspaceMemberRepository.findById(request.leadId())
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));

        Project project = new Project();
        project.setName(request.name());
        project.setWorkspace(workspace);
        project.setLead(member.getUser());
        project.setStatus(Status.PENDING);
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.addMember(user);
        project.addMember(member.getUser());
        project = projectRepository.save(project);
        return projectRepository.save(project).response();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(User user, String workspaceSlug, UUID projectId) {
        return projectRepository.findByIdWorkspaceSlugAndUserId(projectId, workspaceSlug, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found")).response();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAll(User currentUser, UUID workspaceId) {
        return projectRepository.findAllByWorkspaceAndMember(workspaceId, currentUser.getId())
                .stream().map(Project::response).toList();
    }
}
