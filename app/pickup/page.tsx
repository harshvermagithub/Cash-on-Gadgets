import { redirect } from "next/navigation";

export default function PickupRedirect() {
    redirect('/admin/orders');
}
