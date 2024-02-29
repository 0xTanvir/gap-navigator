import React from "react";
import NotificationList from "@/components/notification/notification-list";

export default async function NotificationPage() {
    return (
        <section className="container grid items-center gap-6 pb-8">
            <NotificationList/>
        </section>
    )
}