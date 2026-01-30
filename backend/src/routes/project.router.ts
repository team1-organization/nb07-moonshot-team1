import { Router } from 'express';
import { createProject } from '../controllers/project.contrloller';

const router = Router();

// POST
router.post('/project', createProject);

export default router;