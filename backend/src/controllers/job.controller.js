"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJobDescription = exports.getJobs = exports.createJob = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const generative_ai_1 = require("@google/generative-ai");
const prisma = new client_1.PrismaClient();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const createJob = async (req, res) => {
    try {
        const { title, description, requirements, status } = req.body;
        const job = await prisma.job.create({
            data: {
                title,
                description,
                requirements,
                status: status || client_1.JobStatus.OPEN,
            },
        });
        res.status(201).json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createJob = createJob;
const getJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getJobs = getJobs;
const generateJobDescription = async (req, res) => {
    try {
        const { title, stack } = req.body;
        if (!title || !stack) {
            return res.status(400).json({ message: 'Title and stack are required' });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
        const prompt = `Write a professional and engaging job description for a ${title} role. 
    The tech stack is: ${stack}. 
    Format the output in clean Markdown. Include a brief intro, responsibilities, and requirements.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ description: text });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate job description' });
    }
};
exports.generateJobDescription = generateJobDescription;
//# sourceMappingURL=job.controller.js.map