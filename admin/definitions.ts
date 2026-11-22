import { UUID } from "crypto"

export interface BaseEntity {
  id: UUID
  createdAt: Date
  updatedAt: Date
}

export interface User extends BaseEntity {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthUser extends User {
  token: string
}

export interface Workspace extends BaseEntity {
  name: string
  slug: string
  description: string
}

interface Privilege extends BaseEntity {
  name: string
}

export interface Role extends BaseEntity {
  name: string
  privileges: Privilege[]
}

export interface WorkspaceMember extends BaseEntity {
  user: User
  workspace: Workspace
  roles: Role[]
  status: string
}

export interface Project extends BaseEntity {
  name: string
  workspace: Workspace
  status: string
  startDate: Date
  endDate: Date
}

export type FormErrors = Record<string, string>
