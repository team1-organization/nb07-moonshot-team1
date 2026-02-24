import { Router } from 'express';
import * as imageController from '../controllers/image.controller';
import { withAsync } from '../lib/withAsync';
import { multerUtil } from '../utils/multer.util';

const router = Router();

router.post('/', multerUtil.array('files', 10), withAsync(imageController.uploadImages));

export default router;
