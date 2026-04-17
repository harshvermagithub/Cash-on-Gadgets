import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import EmailClient from "./EmailClient";

export default async function EmailPage() {
    const session = await getSession();
    if (!session || !session.user) {
        redirect("/admin/login");
    }

    return <EmailClient role={session.user.role} userEmail={session.user.email} />;
}
