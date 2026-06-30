import { Request, Response } from 'express';
import { PrismaClient, ApplicationStage } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import nodemailer from 'nodemailer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const applyForJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId, resumeText } = req.body;
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
        resumeText,
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
      data: { status },
      include: { user: true, job: true }
    });

    // Setup Ethereal mock email transport
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"DevBoard Nexus" <noreply@devboard.local>',
      to: application.user.email,
      subject: `Application Update: ${application.job.title}`,
      text: `Hello ${application.user.name},\n\nYour application status for ${application.job.title} has been updated to: ${status}.\n\nBest regards,\nDevBoard Nexus Team`,
    });

    console.log(`[Email Sent] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    const io = req.app.get('io');
    io.emit('applicationStatusChanged', application);

    res.json(application);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const scoreCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: true }
    });

    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (!application.resumeText) return res.status(400).json({ message: 'Candidate has not provided a resume' });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is not configured' });
    }

    const prompt = `
      You are an expert ATS (Applicant Tracking System).
      Job Title: ${application.job.title}
      Job Requirements: ${application.job.requirements}
      Job Description: ${application.job.description}
      
      Applicant Resume/Profile:
      ${application.resumeText}
      
      Analyze how well the applicant matches the job.
      Respond strictly with a JSON object containing two fields:
      "score": an integer from 0 to 100 representing the match percentage.
      "summary": a brief 2-3 sentence explanation of why they got this score.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);

    const updatedApp = await prisma.application.update({
      where: { id },
      data: {
        aiScore: parsed.score,
        aiSummary: parsed.summary
      }
    });

    res.json(updatedApp);
  } catch (error) {
    console.error('AI Scoring Error:', error);
    res.status(500).json({ message: 'Failed to generate AI score' });
  }
};
