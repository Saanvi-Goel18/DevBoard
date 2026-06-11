"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const validRole = Object.values(client_1.Role).includes(role) ? role : client_1.Role.APPLICANT;
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: validRole,
            },
        });
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user.id, user.role);
        res.status(201).json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user.id, user.role);
        res.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map