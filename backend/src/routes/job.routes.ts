import { Router } from 'express';
import { createJob, getJobs, generateJobDescription } from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createJobSchema, generateJobSchema } from '../schemas/job.schema';

const router = Router();

router.post('/', authenticate, authorize(['ADMIN', 'HR']), validate(createJobSchema), createJob);
router.get('/', getJobs);
router.post('/generate', authenticate, authorize(['ADMIN', 'HR']), validate(generateJobSchema), generateJobDescription);

export default router;
