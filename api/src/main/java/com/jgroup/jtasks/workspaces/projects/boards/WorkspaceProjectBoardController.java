package com.jgroup.jtasks.workspaces.projects.boards;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workspaces/{workspaceId}/projects/{projectId}/boards")
public class WorkspaceProjectBoardController {
}
