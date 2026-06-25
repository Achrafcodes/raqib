import { Router } from 'express';
import { getProjects, createProject, getProject, updateProject, deleteProject } from '../controllers/project.controller.js';
import { authMiddleware, validateObjectId } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', validateObjectId, getProject);
router.put('/:id', validateObjectId, updateProject);
router.delete('/:id', validateObjectId, deleteProject);

export default router;
