"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getApplications = exports.applyForJob = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma = new client_1.PrismaClient();
const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.userId;
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
                status: client_1.ApplicationStage.APPLIED
            },
            include: { user: { select: { name: true, email: true } }, job: { select: { title: true } } }
        });
        const io = req.app.get('io');
        io.emit('newApplication', application);
        res.status(201).json(application);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.applyForJob = applyForJob;
const getApplications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        if (role === 'ADMIN' || role === 'HR') {
            const applications = await prisma.application.findMany({
                include: { user: { select: { name: true, email: true } }, job: { select: { title: true } } },
                orderBy: { createdAt: 'desc' }
            });
            return res.json(applications);
        }
        else {
            const applications = await prisma.application.findMany({
                where: { userId },
                include: { job: { select: { title: true } } },
                orderBy: { createdAt: 'desc' }
            });
            return res.json(applications);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getApplications = getApplications;
const updateApplicationStatus = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
//# sourceMappingURL=application.controller.js.map