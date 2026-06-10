import { Request, Response } from 'express';
import { PrismaClient, ApplicationStage } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const applyForJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.user!.userId;

    const existingApplication = await prisma.application.findFirst({
      where: { userId, jobId }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await prisma.application.create({
      data: {
        userId,
        jobId,
        status: ApplicationStage.APPLIED
      },
      include: { user: { select: { name: true, email: true } }, job: { select: { title: true } } }
    });

    const io = req.app.get('io');
    io.emit('newApplication', application);

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    if (role === 'ADMIN' || role === 'HR') {
      const applications = await prisma.application.findMany({
        include: { user: { select: { name: true, email: true } }, job: { select: { title: true } } },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(applications);
    } else {
      const applications = await prisma.application.findMany({
        where: { userId },
        include: { job: { select: { title: true } } },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(applications);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await prisma.application.update({
      where: { id },
      data: { status }
    });

    const io = req.app.get('io');
    io.emit('applicationStatusChanged', application);

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
