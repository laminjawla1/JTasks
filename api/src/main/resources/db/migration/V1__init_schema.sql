CREATE TABLE users (
    id UUID NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT pk_users_id PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_status ON users (status);


CREATE TABLE workspaces (
    id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT pk_workspaces_id PRIMARY KEY (id),
    CONSTRAINT uq_workspaces_name UNIQUE (name),
    CONSTRAINT uq_workspaces_slug UNIQUE (name)
);


CREATE TABLE workspace_memberships (
    id UUID NOT NULL,
    user_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_INVITE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_workspace_memberships_user_id ON workspace_memberships (user_id);
CREATE INDEX idx_workspace_memberships_workspace_id ON workspace_memberships (workspace_id);
CREATE INDEX idx_workspace_memberships_status ON workspace_memberships (status);


CREATE TABLE privileges (
    id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT pk_privileges_id PRIMARY KEY (id),
    CONSTRAINT uq_privileges_name UNIQUE (name)
);


CREATE TABLE roles (
    id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    workspace_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT pk_roles_id PRIMARY KEY (id),
    CONSTRAINT fk_roles_workspace_id FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
    CONSTRAINT uq_roles_name UNIQUE (name)
);


CREATE TABLE role_privileges (
    role_id UUID NOT NULL,
    privilege_id UUID NOT NULL,

    CONSTRAINT pk_role_privileges PRIMARY KEY (role_id, privilege_id)
);


CREATE TABLE projects (
    id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    workspace_id UUID NOT NULL,
    lead_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    start_date DATE NOT NULL,
    end_date DATE,

    CONSTRAINT pk_projects_id PRIMARY KEY (id),
    CONSTRAINT fk_projects_workspace_id FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    CONSTRAINT fk_projects_lead_id FOREIGN KEY (lead_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_projects_workspace_id ON projects (workspace_id);
CREATE INDEX idx_projects_lead_id ON projects (lead_id);
CREATE INDEX idx_projects_status ON projects (status);


CREATE TABLE project_memberships (
    id UUID NOT NULL,
    user_id UUID NOT NULL,
    project_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_INVITE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_project_memberships_user_id ON project_memberships (user_id);
CREATE INDEX idx_project_memberships_project_id ON project_memberships (project_id);
CREATE INDEX idx_project_memberships_workspace_id ON project_memberships (workspace_id);
CREATE INDEX idx_project_memberships_status ON project_memberships (status);


CREATE TABLE boards (
    id UUID NOT NULL,
    project_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    board_order FLOAT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT pk_boards_id PRIMARY KEY (id)
);
CREATE INDEX idx_boards_project_id ON boards (project_id);
CREATE INDEX idx_boards_board_order ON boards (board_order);


CREATE TABLE tasks (
    id UUID NOT NULL,
    board_id UUID NOT NULL,
    project_id UUID NOT NULL,
    summary VARCHAR(255) NOT NULL,
    description TEXT,
    task_order FLOAT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    due_date date,
    status VARCHAR(50) NOT NULL DEFAULT 'TODO',

    CONSTRAINT pk_tasks_id PRIMARY KEY (id),
    CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id),
    CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES projects(id)
);
CREATE INDEX idx_tasks_board_id ON tasks (board_id);
CREATE INDEX idx_tasks_project_id ON tasks (project_id);
CREATE INDEX idx_tasks_task_order ON tasks (task_order);
CREATE INDEX idx_tasks_status ON tasks (status);


CREATE TABLE task_assignees (
    task_id UUID NOT NULL,
    assignee_id UUID NOT NULL,

    CONSTRAINT pk_task_assignees PRIMARY KEY (task_id, assignee_id)
);


CREATE TABLE workspace_membership_roles (
  membership_id UUID NOT NULL,
  role_id UUID NOT NULL,

  CONSTRAINT pk_workspace_membership_roles PRIMARY KEY (membership_id, role_id)
);
