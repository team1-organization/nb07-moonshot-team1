import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import projectRouter from './routes/project.router';
import userRouter from './routes/user.router';

const app = express();

(BigInt.prototype as any).toJSON = function (this: bigint): string {
  return this.toString();
};

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/api/projects', projectRouter);
app.use('/auth/register', userRouter);

export default app;
