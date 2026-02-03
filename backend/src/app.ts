import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import memberRouter from "./routes/memberRoutes";

const app = express();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/", memberRouter);

export default app;
