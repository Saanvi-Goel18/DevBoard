import { Router } from 'express';
import { createJob, getJobs, generateJobDescription } from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize(['ADMIN', 'HR']), createJob);
router.get('/', authenticate, getJobs);
router.post('/generate', authenticate, authorize(['ADMIN', 'HR']), generateJobDescription);

export default router;
