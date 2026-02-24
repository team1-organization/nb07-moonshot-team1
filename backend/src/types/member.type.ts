import { safeString } from '../utils/string.util';
import { safeNumber } from '../utils/number.util';

export type MemberStatus = 'INVITED' | 'JOINED' | 'DECLINED';
export type MemberRoleType = 'MEMBER' | 'OWNER';
export type MemberResponseStatus = 'pending' | 'accepted' | 'rejected';
export interface MemberData {
  id: bigint;
  project_id: bigint;
  user_id: bigint;
  status: MemberStatus;
  role: MemberRoleType;
  isMe: boolean;
  user: {
    id: bigint;
    email: string;
    name: string;
    profile_image: string | null;
    task?: { id: bigint }[];
    _count: { tasks: number };
  };
  projects?: {
    id: bigint;
    title: string;
    description: string;
  };
}
export interface MemberParam {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  status: MemberResponseStatus;
  taskCount: number;
  invitationId: string;
}

export class Member {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly profileImage: string | null;
  readonly taskCount: number;
  readonly status: MemberResponseStatus;
  readonly invitationId: string;

  constructor(params: MemberParam) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.profileImage = params.profileImage;
    this.taskCount = params.taskCount;
    this.status = params.status;
    this.invitationId = params.invitationId;
  }
  static fromEntity(data: MemberData): Member {
    if (!data) throw new Error('데이터가 없습니다.');
    const statusMap: Record<MemberStatus, MemberResponseStatus> = {
      INVITED: 'pending',
      JOINED: 'accepted',
      DECLINED: 'rejected',
    };
    const rawTaskCount = data.user._count?.tasks ?? data.user.task?.length ?? 0;
    return new Member({
      id: safeString(data.user.id),
      name: data.user.name,
      email: data.user.email,
      profileImage: data.user.profile_image,
      status: statusMap[data.status],
      taskCount: safeNumber(rawTaskCount),
      invitationId: safeString(data.id),
    });
  }
  static fromEntityList(data: MemberData[]): Member[] {
    return data.map((member: MemberData) => Member.fromEntity(member));
  }
}
