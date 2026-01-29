import express from 'express';
import * as memberController from '../controllers/memberController';

const router = express.Router();

router.get('/me', memberController.getMyProfile);

export default router;