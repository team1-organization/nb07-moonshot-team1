import type { User as UserType } from './user.type';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends UserType {}
    interface Request {
      user?: User;
      file?: Multer.File;
      files?: Multer.File[] | { [fieldName: string]: Multer.File[] };
    }
  }
  interface BigInt {
    toJSON(): string;
  }
}

export {};
