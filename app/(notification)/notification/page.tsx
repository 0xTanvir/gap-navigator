import NotificationList from "@/components/notification/notification-list";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function NotificationPage() {
    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <DashboardHeader heading="Notification List" text="Manage notification list."/>
            <NotificationList/>
        </section>
    )
}