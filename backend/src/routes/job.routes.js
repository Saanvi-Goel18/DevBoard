"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("../controllers/job.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const job_schema_1 = require("../schemas/job.schema");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['ADMIN', 'HR']), (0, validate_middleware_1.validate)(job_schema_1.createJobSchema), job_controller_1.createJob);
router.get('/', job_controller_1.getJobs);
router.post('/generate', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['ADMIN', 'HR']), (0, validate_middleware_1.validate)(job_schema_1.generateJobSchema), job_controller_1.generateJobDescription);
exports.default = router;
//# sourceMappingURL=job.routes.js.map