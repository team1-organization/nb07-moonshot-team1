import { Router } from 'express';
import { createUser } from '../controllers/user.controller';

const router = Router();

//POST
router.post('/', createUser);

export default router;
