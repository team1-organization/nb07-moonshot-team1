import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.router';
import { errorHandler } from './errors/errorHandler';
import taskRouter from './routes/task.router';
import projectRouter from './routes/project.router';

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

const app = express();
app.use(morgan('dev'));
app.use(morgan(':method :url '));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);

app.use(errorHandler);
export default app;
