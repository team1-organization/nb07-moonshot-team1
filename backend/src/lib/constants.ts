import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const processEnv = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(10),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(10),
  ACCESS_TOKEN_COOKIE_NAME: z.string().min(5),
  REFRESH_TOKEN_COOKIE_NAME: z.string().min(5),
});

const env = processEnv.parse(process.env);

export const PORT: number = env.PORT;
export const ACCESS_TOKEN_COOKIE_NAME = env.ACCESS_TOKEN_COOKIE_NAME;
export const REFRESH_TOKEN_COOKIE_NAME = env.REFRESH_TOKEN_COOKIE_NAME;
export const JWT_ACCESS_TOKEN_SECRET = env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = env.JWT_REFRESH_TOKEN_SECRET;
