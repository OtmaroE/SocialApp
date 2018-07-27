import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid/v1';
import client from './redis';

import { UnauthorizedException } from '@nestjs/common';
const { SECRET } = process.env;

export const createJWT = (user, parsedRoles: string[]) => {
    const tokenUUID = uuid();
    const token = jwt.sign({ id: user._id, username: user.username, roles: parsedRoles, uuid: tokenUUID }, SECRET, { expiresIn: '12h' });
    client.set(`${tokenUUID}`, 'token', 'EX', '43200');
    return token;
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
