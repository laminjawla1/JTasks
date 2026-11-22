package com.jgroup.jtasks.projects.boards;

import com.jgroup.jtasks.projects.projects.ProjectRepository;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.users.UserRepository;
import com.jgroup.jtasks.workspaces.members.WorkspaceMemberRepository;
import com.jgroup.jtasks.workspaces.WorkspaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    @Transactional
    public BoardResponse createBoard(User currentUser, UUID workspaceId, UUID projectId, BoardRequest request) {
        var user = userRepository.findById(currentUser.getId()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var workspace = workspaceRepository.findById(workspaceId).orElseThrow(() -> new EntityNotFoundException("Workspace not found"));
        var project = projectRepository.findById(projectId).orElseThrow(() -> new EntityNotFoundException("Project not found"));

        // make sure the current user is allowed to access and create boards in this workspace and project
        workspaceMemberRepository.findByUserIdAndWorkspaceId(user.getId(), workspace.getId())
                .orElseThrow(() -> new AccessDeniedException("You are not authorised to view this workspace."));

        var board = new Board();
        board.setName(request.name());
        board.setProject(project);
        return boardRepository.save(board).response();
    }

    @Transactional(readOnly = true)
    public List<BoardResponse> getBoards(User currentUser, UUID workspaceId, UUID projectId) {
        return boardRepository.findByUserWorkspaceAndProject(currentUser.getId(), workspaceId, projectId)
                .stream().map(Board::response).toList();
    }
}
