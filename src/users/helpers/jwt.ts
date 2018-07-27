import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
const { SECRET } = process.env;

export const createJWT = (user) => {
  return jwt.sign({ id: user._id, username: user.username, role: user.role }, SECRET, { expiresIn: '12h'});
};

export const validateJWT = (token) => {
  let decoded = {};
  try {
    decoded = jwt.verify(token, SECRET);
  } catch (e) {
    if (e.name === 'JsonWebTokenError') throw new UnauthorizedException(e.message);
    if (e.name === 'TokenExpiredError') throw new UnauthorizedException('Token has expired');
  }
  return decoded;
};