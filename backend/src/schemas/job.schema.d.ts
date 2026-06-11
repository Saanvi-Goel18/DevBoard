import { z } from 'zod';
export declare const createJobSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        requirements: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const generateJobSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        stack: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=job.schema.d.ts.map