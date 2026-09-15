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
        <div className="flex items-center gap-1.5 sm:gap-2 opacity-60">
            <div className="h-7 w-14 sm:w-20 bg-muted/60 rounded-full animate-pulse" />
            <div className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" />
            <div className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" />
        </div>
    );
}
