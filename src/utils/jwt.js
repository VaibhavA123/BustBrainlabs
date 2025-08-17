import jwt from 'jsonwebtoken';

export function signUserJwt(userId) {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
