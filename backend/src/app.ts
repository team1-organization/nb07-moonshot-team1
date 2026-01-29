import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import memberRoutes from './routes/memberRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/members', memberRoutes);

export default app;
