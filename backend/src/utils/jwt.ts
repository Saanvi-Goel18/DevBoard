import jwt from 'jsonwebtoken';

export const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
