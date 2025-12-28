
'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, ''); // Sanitize filename

    // Save to public/uploads
    // Note: In production (Vercel), writing to the filesystem is ephemeral and won't persist.
    // This is suitable for local development or VPS hosting.
    const path = join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(path, buffer);

    return `/uploads/${filename}`;
}
