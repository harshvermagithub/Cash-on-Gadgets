
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

const KEY = new TextEncoder().encode(process.env.AUTH_SECRET || 'secret_key_123');

export interface SessionUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface SessionPayload extends JWTPayload {
    user: SessionUser;
    expires: Date | string;
}

export async function encrypt(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1 week')
        .sign(KEY);
}

export async function decrypt(input: string): Promise<SessionPayload> {
    const { payload } = await jwtVerify(input, KEY, {
        algorithms: ['HS256'],
    });
    return payload as SessionPayload;
}

export async function getSession(): Promise<SessionPayload | null> {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
        console.log('DEBUG: No session cookie found');
        return null;
    }
    try {
        const payload = await decrypt(sessionCookie);
        console.log('DEBUG: Decrypted payload:', JSON.stringify(payload, null, 2));
        return payload;
    } catch (e) {
        console.log('DEBUG: Session decryption failed', e);
        return null;
    }
}

export async function login(userData: { id: string; email: string; name: string; role: string }) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
    const session = await encrypt({ user: userData, expires });

    (await cookies()).set('session', session, { expires, httpOnly: true, sameSite: 'lax' });
}

export async function logout() {
    (await cookies()).set('session', '', { expires: new Date(0) });
}
