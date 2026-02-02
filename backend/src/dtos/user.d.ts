declare global {
  interface User {
    id: bigint;
    email: string;
    password: string;
    name: string;
    profile_image: string | null;
    provider: LOCAL;
    created_at: Date;
    updated_at: Date;
  }
}

export {};
