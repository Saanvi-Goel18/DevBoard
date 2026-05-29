import { Router } from 'express';
import { applyForJob, getApplications, updateApplicationStatus } from '../controllers/application.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, applyForJob);
router.get('/', authenticate, getApplications);
router.patch('/:id/status', authenticate, authorize(['ADMIN', 'HR']), updateApplicationStatus);

export default router;
