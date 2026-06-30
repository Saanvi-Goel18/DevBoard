import { Router } from 'express';
import { applyForJob, getApplications, updateApplicationStatus, scoreCandidate } from '../controllers/application.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize(['APPLICANT', 'EMPLOYEE']), applyForJob);
router.get('/', authenticate, getApplications);
router.patch('/:id/status', authenticate, authorize(['ADMIN', 'HR']), updateApplicationStatus);
router.post('/:id/score', authenticate, authorize(['ADMIN', 'HR']), scoreCandidate);

export default router;
