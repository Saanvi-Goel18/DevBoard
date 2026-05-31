"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authenticate, application_controller_1.applyForJob);
router.get('/', auth_middleware_1.authenticate, application_controller_1.getApplications);
router.patch('/:id/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['ADMIN', 'HR']), application_controller_1.updateApplicationStatus);
exports.default = router;
//# sourceMappingURL=application.routes.js.map