import { getSession } from '@/lib/session';
import { isAdmin } from '@/lib/auth-utils';
import { HeaderClientControls } from './HeaderClientControls';

export default async function HeaderActions() {
    const session = await getSession();
    const isAdminUser = session ? isAdmin(session.user) : false;

    return <HeaderClientControls session={session} isAdminUser={isAdminUser} />;
}

export function HeaderActionsSkeleton() {
    return (
        <div className="flex items-center gap-3 opacity-60">
            <div className="hidden lg:flex gap-3">
                <div className="h-7 w-20 bg-muted/60 rounded-full animate-pulse" />
                <div className="h-7 w-20 bg-muted/60 rounded-full animate-pulse" />
                <div className="h-7 w-16 bg-muted/60 rounded-full animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-muted/60 animate-pulse rounded-full" />
            <div className="h-9 w-9 bg-muted/60 animate-pulse rounded-full" />
        </div>
    );
}
