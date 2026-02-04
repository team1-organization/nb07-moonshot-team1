import 'dotenv/config';
import app from './app';
import { PORT } from './lib/constants.js';

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`${PORT}번 포트에서 서버 실행 중...`);
});
