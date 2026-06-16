import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';
import { generateTokens } from '../utils/jwt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const validRole = Object.values(Role).includes(role) ? role : Role.APPLICANT;

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: validRole },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    return res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Use generic message to prevent email enumeration
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    return res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};
