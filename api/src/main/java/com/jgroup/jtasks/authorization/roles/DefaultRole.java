package com.jgroup.jtasks.authorization.roles;

import com.jgroup.jtasks.authorization.privileges.Privileges;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.EnumSet;
import java.util.Set;

@Getter
@RequiredArgsConstructor
public enum DefaultRole {
    OWNER(EnumSet.allOf(Privileges.class), true),

    ADMINISTRATOR(EnumSet.allOf(Privileges.class), false),

    MANAGER(EnumSet.of(
            Privileges.PROJECTS_BOARDS_CREATE,
            Privileges.PROJECTS_BOARDS_READ,
            Privileges.PROJECTS_BOARDS_UPDATE,

            Privileges.PROJECTS_MEMBERSHIP_CREATE,
            Privileges.PROJECTS_MEMBERSHIP_READ,
            Privileges.PROJECTS_MEMBERSHIP_UPDATE,

            Privileges.PROJECTS_PROJECT_CREATE,
            Privileges.PROJECTS_PROJECT_READ,
            Privileges.PROJECTS_PROJECT_UPDATE,

            Privileges.PROJECTS_TASK_CREATE,
            Privileges.PROJECTS_TASK_READ,
            Privileges.PROJECTS_TASK_UPDATE
    ), false),

    STAFF(EnumSet.of(
            Privileges.PROJECTS_BOARDS_CREATE,
            Privileges.PROJECTS_BOARDS_READ,
            Privileges.PROJECTS_BOARDS_UPDATE,

            Privileges.PROJECTS_MEMBERSHIP_CREATE,
            Privileges.PROJECTS_MEMBERSHIP_READ,
            Privileges.PROJECTS_MEMBERSHIP_UPDATE,

            Privileges.PROJECTS_PROJECT_READ,

            Privileges.PROJECTS_TASK_CREATE,
            Privileges.PROJECTS_TASK_READ,
            Privileges.PROJECTS_TASK_UPDATE
    ), false),

    GUEST(EnumSet.of(
            Privileges.PROJECTS_BOARDS_READ,
            Privileges.PROJECTS_PROJECT_READ,
            Privileges.PROJECTS_TASK_READ
    ), false);

    private final Set<Privileges> privileges;
    private final boolean systemRole;

}
