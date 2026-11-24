package com.jgroup.jtasks.projects.services;

import com.jgroup.jtasks.projects.dto.ProjectRequest;
import com.jgroup.jtasks.projects.dto.ProjectResponse;
import com.jgroup.jtasks.projects.domains.Project;
import com.jgroup.jtasks.projects.dto.ProjectUpdate;
import com.jgroup.jtasks.projects.enums.*;
import com.jgroup.jtasks.projects.repositories.ProjectRepository;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.users.UserRepository;
import com.jgroup.jtasks.workspaces.domains.WorkspaceMember;
import com.jgroup.jtasks.workspaces.repositories.WorkspaceMemberRepository;
import com.jgroup.jtasks.workspaces.domains.Workspace;
import com.jgroup.jtasks.workspaces.repositories.WorkspaceRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ProjectResponse create(User currentUser, UUID workspaceId, ProjectRequest request) {
        User user = userRepository
                .findById(currentUser.getId()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Workspace workspace = workspaceRepository
                .findByUserAndId(currentUser.getId(), workspaceId).orElseThrow(() -> new EntityNotFoundException("Workspace does not exist"));

        WorkspaceMember lead = workspaceMemberRepository.findById(request.leadId())
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));

        Project project = new Project();
        project.setName(request.name());
        project.setWorkspace(workspace);
        project.setLead(lead.getUser());
        project.setStatus(ProjectStatus.PENDING);
        project.setVisibility(request.visibility());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.addMember(user);
        project.addMember(lead.getUser());
        project = projectRepository.save(project);
        return projectRepository.save(project).response();
    }

    @Transactional(readOnly = true)
    public ProjectResponse get(User currentUser, UUID workspaceId, UUID projectId) {
        return projectRepository.findByUserWorkspaceAndId(currentUser.getId(), workspaceId, projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found")).response();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAll(User currentUser, UUID workspaceId) {
        return projectRepository.findAllByWorkspaceAndMember(workspaceId, currentUser.getId())
                .stream().map(Project::response).toList();
    }

    @Transactional
    public ProjectResponse update(User currentUser, UUID workspaceId, UUID projectId, @Valid ProjectUpdate request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Workspace workspace = workspaceRepository.findByUserAndId(user.getId(), workspaceId)
                .orElseThrow(() -> new EntityNotFoundException("Workspace not found"));

        Project project = projectRepository.findByUserWorkspaceAndId(user.getId(), workspace.getId(), projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        WorkspaceMember lead = workspaceMemberRepository.findById(request.leadId())
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));

        project.setName(request.name());
        project.setWorkspace(workspace);
        project.setLead(lead.getUser());
        project.setStatus(request.status());
        project.setVisibility(request.visibility());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.addMember(user);
        project.addMember(lead.getUser());
        project = projectRepository.save(project);
        return projectRepository.save(project).response();
    }

    @Transactional
    public void delete(User currentUser, UUID workspaceId, UUID projectId) {
        Project project = projectRepository.findByUserWorkspaceAndId(currentUser.getId(), workspaceId, projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        projectRepository.delete(project);
    }
}
