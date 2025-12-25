
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const KEY = new TextEncoder().encode(process.env.AUTH_SECRET || 'secret_key_123');

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1 week')
        .sign(KEY);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, KEY, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch (error) {
        return null;
    }
}

export async function login(userData: { id: string; email: string; name: string }) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
    const session = await encrypt({ user: userData, expires });

    (await cookies()).set('session', session, { expires, httpOnly: true, sameSite: 'lax' });
}

export async function logout() {
    (await cookies()).set('session', '', { expires: new Date(0) });
}
