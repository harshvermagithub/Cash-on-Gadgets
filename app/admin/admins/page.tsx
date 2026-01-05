import { getAdmins } from '@/actions/admin';
import AdminManager from '@/components/admin/AdminManager';

export default async function AdminsPage() {
    const admins = await getAdmins();

    return (
        <div className="container mx-auto max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Management</h1>
                <p className="text-muted-foreground">Manage system administrators and access control.</p>
            </div>

            <AdminManager admins={admins} />
        </div>
    );
}
