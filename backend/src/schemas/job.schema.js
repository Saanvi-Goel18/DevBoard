"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJobSchema = exports.createJobSchema = void 0;
const zod_1 = require("zod");
exports.createJobSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, 'Title is required'),
        description: zod_1.z.string().min(10, 'Description must be detailed'),
        requirements: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.generateJobSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(2, 'Title is required'),
        stack: zod_1.z.string().min(2, 'Stack is required'),
    }),
});
//# sourceMappingURL=job.schema.js.map