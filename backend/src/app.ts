import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './errors/errorHandler';
import authRouter from './routes/auth.router';
import taskRouter from './routes/task.router';
import projectRouter from './routes/project.router';
import subTaskRouter from './routes/subTask.router';
import commentRouter from './routes/comment.router';
import userRouter from './routes/user.router';
import memberRouter from './routes/member.router';
import imageRouter from './routes/image.router';
import path from 'path';

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

const app = express();
app.use(morgan('dev'));
app.use(morgan(':method :url '));
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);
app.use('/subtasks', subTaskRouter);
app.use('/comments', commentRouter);
app.use('/users', userRouter);
app.use('/invitations', memberRouter);
app.use('/files', imageRouter);
app.use(errorHandler);
export default app;
