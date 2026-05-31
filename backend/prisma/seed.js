"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcrypt_1.default.hash('password123', 10);
    // Clear existing data to avoid unique constraint errors during multiple seed runs
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();
    await prisma.user.deleteMany();
    const admin = await prisma.user.create({
        data: {
            email: 'admin@devboard.local',
            name: 'Admin Nexus',
            password: hashedPassword,
            role: client_1.Role.ADMIN,
        }
    });
    const applicant1 = await prisma.user.create({
        data: {
            email: 'john@example.com',
            name: 'John Doe',
            password: hashedPassword,
            role: client_1.Role.APPLICANT,
        }
    });
    const applicant2 = await prisma.user.create({
        data: {
            email: 'jane@example.com',
            name: 'Jane Smith',
            password: hashedPassword,
            role: client_1.Role.APPLICANT,
        }
    });
    const applicant3 = await prisma.user.create({
        data: {
            email: 'alex@example.com',
            name: 'Alex Johnson',
            password: hashedPassword,
            role: client_1.Role.APPLICANT,
        }
    });
    const job1 = await prisma.job.create({
        data: {
            title: 'Senior Frontend Engineer',
            description: 'We are looking for an expert in React, TypeScript, and Tailwind CSS.',
            requirements: 'React, TypeScript, 5+ years experience.',
            status: client_1.JobStatus.OPEN,
        }
    });
    await prisma.application.createMany({
        data: [
            { userId: applicant1.id, jobId: job1.id, status: client_1.ApplicationStage.APPLIED },
            { userId: applicant2.id, jobId: job1.id, status: client_1.ApplicationStage.INTERVIEWED },
            { userId: applicant3.id, jobId: job1.id, status: client_1.ApplicationStage.SHORTLISTED },
        ]
    });
    console.log('Database seeded successfully! Demo data populated.');
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map