import { env } from "./env";

const jwt = require('jsonwebtoken');
const secretKey: string = env.TOKEN_KEY;

type Decoded = {
    id: string,
    name: string,
    email: string,
    state: string,
    beeKeeper: null | {}
}

export function generateToken(
    userId: string,
    name: string,
    email: string,
    state: string,
    beeKeeper: null | {}
) {
    const expiresIn = '6h';
    const payload = {
        id: userId,
        name: name,
        email: email,
        state: state,
        beeKeeper: beeKeeper
    };
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
};

export function verifyToken(token: string) {
    try {
        const decoded: Decoded = jwt.verify(token, secretKey);
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, error, };
    }
}