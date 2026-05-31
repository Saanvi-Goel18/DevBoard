import { Request, Response } from 'express';
export declare const createJob: (req: Request, res: Response) => Promise<void>;
export declare const getJobs: (req: Request, res: Response) => Promise<void>;
export declare const generateJobDescription: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=job.controller.d.ts.map