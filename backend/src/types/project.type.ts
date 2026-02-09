import { safeString } from '../utils/string.util';
import { DATE_FORMAT } from '../dtos/common.dto';
import { TaskStatus } from './task.type';
import { UserData } from './user.type';

export type ProjectRole = 'OWNER' | 'MEMBER';
export type projectStatus = 'JOINED' | 'INVITED';

export interface ProjectData {
  id: bigint;
  user_id: bigint;
  title: string;
  description: string;
  user: {
    id: bigint;
    name: string;
    email: string;
    profile_image: string | null;
  };
  task: {
    id: bigint;
    title: string;
    status: TaskStatus;
  }[];
  member: {
    user_id: bigint;
    role: ProjectRole;
  }[];
  created_at: Date;
  updated_at: Date;
}

export interface ProjectParams {
  id: string;
  user_id: string;
  title: string;
  description: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile_image: string | null;
  };
  task: {
    id: string;
    title: string;
    status: TaskStatus;
  }[];
  //member
  created_at: string;
  updated_at: string;
}

export class Project {
  readonly id: string;
  readonly user_id: string;
  readonly title: string;
  readonly description: string;
  readonly user: {
    id: string;
    name: string;
    email: string;
    profile_image: string | null;
  };
  readonly task: {
    id: string;
    title: string;
    status: TaskStatus;
  }[];
  readonly created_at: string;
  readonly updated_at: string;

  constructor(params: ProjectParams) {
    this.id = params.id;
    this.user_id = params.user_id;
    this.title = params.title;
    this.description = params.description;
    this.user = params.user;
    this.task = params.task;
    this.created_at = params.created_at;
    this.updated_at = params.updated_at;
  }
  static fromEntity(data: ProjectData): Project {
    if (!data) throw new Error('데이터가 없습니다.');
    return new Project({
      id: safeString(data.id),
      user_id: safeString(data.user_id),
      title: safeString(data.title),
      description: safeString(data.description),
      user: {
        id: safeString(data.user.id),
        name: data.user.name,
        email: data.user.email,
        profile_image: data.user.profile_image,
      },
      task: data.task.map((task) => ({
        id: safeString(task.id),
        title: task.title,
        status: task.status,
      })),
      created_at: data.created_at.toLocaleDateString(DATE_FORMAT),
      updated_at: data.updated_at.toLocaleDateString(DATE_FORMAT),
    });
  }
  static fromEntityList(data: ProjectData[]): Project[] {
    return data.map((projectData) => Project.fromEntity(projectData));
  }
}

export interface ProjectSummaryData {
  id: bigint;
  title: string;
  member: {
    id: bigint;
  }[];
  tasks: {
    status: TaskStatus;
  }[];
  created_at: Date;
  updated_at: Date;
}

export interface ProjectSummaryParam {
  id: string;
  title: string;
  memberCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  createdAt: string;
  updatedAt: string;
}

export class ProjectSummary {
  readonly id: string;
  readonly title: string;
  readonly memberCount: number;
  readonly todoCount: number;
  readonly inProgressCount: number;
  readonly doneCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  constructor(params: ProjectSummaryParam) {
    this.id = safeString(params.id);
    this.title = params.title;
    this.memberCount = params.memberCount;
    this.todoCount = params.todoCount;
    this.inProgressCount = params.inProgressCount;
    this.doneCount = params.doneCount;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
  static fromEntity(data: ProjectSummaryData): ProjectSummary {
    if (!data) throw new Error('데이터가 없습니다.');

    const taskData = (data.tasks || []).reduce(
      (acc, task) => {
        if (task.status === 'TODO') acc.todo++;
        else if (task.status === 'IN_PROGRESS') acc.inProgress++;
        else if (task.status === 'DONE') acc.done++;
        return acc;
      },
      { todo: 0, inProgress: 0, done: 0 },
    );

    return new ProjectSummary({
      id: safeString(data.id),
      title: data.title,
      memberCount: data.member.length || 0,
      todoCount: taskData.todo,
      inProgressCount: taskData.inProgress,
      doneCount: taskData.done,
      createdAt: LocalDateTime(data.created_at).format(DATE_FORMAT),
      updatedAt: LocalDateTime(data.updated_at).format(DATE_FORMAT),
    });
  }
  static fromEntityList(data: ProjectSummaryData[]): ProjectSummary[] {
    return data.map((projectSummary: ProjectSummaryData) =>
      ProjectSummary.fromEntity(projectSummary),
    );
  }
}