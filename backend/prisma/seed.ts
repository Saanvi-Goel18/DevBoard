import { PrismaClient, Role, JobStatus, ApplicationStage } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clear existing data to avoid unique constraint errors during multiple seed runs
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: 'admin@devboard.local',
      name: 'Admin Nexus',
      password: hashedPassword,
      role: Role.ADMIN,
    }
  });

  const applicant1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      password: hashedPassword,
      role: Role.APPLICANT,
    }
  });

  const applicant2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: Role.APPLICANT,
    }
  });

  const applicant3 = await prisma.user.create({
    data: {
      email: 'alex@example.com',
      name: 'Alex Johnson',
      password: hashedPassword,
      role: Role.APPLICANT,
    }
  });

  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Frontend Engineer',
      description: 'We are looking for an expert in React, TypeScript, and Tailwind CSS.',
      requirements: 'React, TypeScript, 5+ years experience.',
      status: JobStatus.OPEN,
    }
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Backend Node.js Developer',
      description: 'Join our platform team building scalable APIs with Node.js, Express, and Prisma.',
      requirements: 'Node.js, Express, PostgreSQL, REST APIs.',
      status: JobStatus.OPEN,
    }
  });

  await prisma.application.createMany({
    data: [
      { userId: applicant1.id, jobId: job1.id, status: ApplicationStage.APPLIED },
      { userId: applicant2.id, jobId: job1.id, status: ApplicationStage.INTERVIEWED },
      { userId: applicant3.id, jobId: job1.id, status: ApplicationStage.SHORTLISTED },
      { userId: applicant1.id, jobId: job2.id, status: ApplicationStage.OFFERED },
    ]
  });

  console.log(`✅ Database seeded successfully!`);
  console.log(`   Admin:      ${admin.email}`);
  console.log(`   Applicants: ${applicant1.email}, ${applicant2.email}, ${applicant3.email}`);
  console.log(`   Jobs:       ${job1.title}, ${job2.title}`);
  console.log(`\n   Default password for all accounts: password123`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
