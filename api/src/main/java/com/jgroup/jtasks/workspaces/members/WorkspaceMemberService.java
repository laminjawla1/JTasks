package com.jgroup.jtasks.workspaces.members;

import com.jgroup.jtasks.commons.MembershipStatus;
import com.jgroup.jtasks.users.User;
import com.jgroup.jtasks.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceMemberService {
    private final UserRepository userRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    @Transactional(readOnly = true)
    public List<WorkspaceMemberResponse> getMembers(User currentUser, UUID workspaceId) {
        var user = userRepository.findById(currentUser.getId()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        workspaceMemberRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId)
                .orElseThrow(() -> new AccessDeniedException("You are not authorised to view this workspace"));
        return workspaceMemberRepository.findAllByWorkspaceId(workspaceId, MembershipStatus.ACTIVE)
                .stream().map(WorkspaceMember::response).toList();
    }
}
