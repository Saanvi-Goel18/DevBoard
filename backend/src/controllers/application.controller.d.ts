import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const applyForJob: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getApplications: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateApplicationStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=application.controller.d.ts.map