import { Request, Response } from 'express';
import { PrismaClient, JobStatus } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, requirements, status } = req.body;
    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        status: status || JobStatus.OPEN,
      },
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const generateJobDescription = async (req: Request, res: Response) => {
  try {
    const { title, stack } = req.body;
    if (!title || !stack) {
      return res.status(400).json({ message: 'Title and stack are required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Write a professional and engaging job description for a ${title} role. 
    The tech stack is: ${stack}. 
    Format the output in clean Markdown. Include a brief intro, responsibilities, and requirements.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ description: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Failed to generate job description' });
  }
};
