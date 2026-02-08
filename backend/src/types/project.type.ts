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
