import { Router } from 'express';
import { createProject } from '../controllers/project.controller';

const router = Router();

// POST
router.post('/', createProject);

export default router;
