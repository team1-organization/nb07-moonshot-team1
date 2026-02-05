export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'FACEBOOK' | 'NAVER';
export interface UserData {
  id: bigint;
  email: string;
  name: string;
  profile_image: string | null;
  provider: AuthProvider;
  provider_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserParams {
  id: string;
  email: string;
  name: string;
  profileImage: string | null;
  provider: string;
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly profileImage: string | null;
  readonly provider: string;
  readonly providerId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor({
    id,
    email,
    name,
    profileImage,
    provider,
    providerId,
    createdAt,
    updatedAt,
  }: UserParams) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.profileImage = profileImage;
    this.provider = provider;
    this.providerId = providerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromEntity(data: UserData): User {
    if (!data) throw new Error('데이터가 없습니다.');
    return new User({
      id: data.id.toString(),
      email: data.email,
      name: data.name,
      profileImage: data.profile_image || null,
      provider: data.provider,
      providerId: data.provider_id ? data.provider_id.toString() : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
  static fromEntityList(data: UserData[]): User[] {
    return data.map((userData: UserData) => User.fromEntity(userData));
  }
}
