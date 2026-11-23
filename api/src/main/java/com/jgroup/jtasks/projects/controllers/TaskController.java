package com.jgroup.jtasks.projects.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workspaces/{workspaceId}/projects/{projectId}/boards/{boardId}/tasks")
public class TaskController {
}
