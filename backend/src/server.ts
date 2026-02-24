import 'dotenv/config';
import app from './app';
import { PORT } from './lib/constants.js';

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`${PORT}번 포트에서 서버 실행 중...`);
    });
  } catch (error) {
    console.error('서버 시작 중 오류 발생:', error);
    process.exit(1);
  }
};

startServer();
