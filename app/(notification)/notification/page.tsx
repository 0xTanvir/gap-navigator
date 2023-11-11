import NotificationItem from "@/components/notification/notification-item";
import {Notification} from "@/types/dto";

let notificationData: Notification[] = [
    {
        id: 1,
        "title": "New Message 1",
        "body": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque eius facilis ipsam reprehenderit tenetur? Aliquam dignissimos enim nostrum tempore? Distinctio esse iure optio pariatur tenetur voluptate voluptates. Debitis, eius, similique?",
        "timestamp": "2023-11-11T12:30:00",
    }, {
        id: 2,
        "title": "New Message 2",
        "body": "Lorem ipsum dolor sit amet.",
        "timestamp": "2023-11-11T12:30:00",
    }, {
        id: 3,
        "title": "New Message 3",
        "body": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum fugiat omnis pariatur ratione vitae. Animi!",
        "timestamp": "2023-11-11T12:30:00",
    }, {
        id: 4,
        "title": "New Message 4",
        "body": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis nemo numquam provident unde. Delectus dolorum fuga praesentium quaerat quod vitae.",
        "timestamp": "2023-11-11T12:30:00",
    },
]
export default async function NotificationPage() {
    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <h2 className="font-heading text-3xl md:text-4xl">Notification List</h2>
            {
                notificationData?.length && (
                    <div className="divide-y divide-border rounded-md border">
                        {notificationData.map((notification) => (
                            <NotificationItem key={notification.id} notification={notification}/>
                        ))}
                    </div>
                )
            }
            <p></p>
        </section>
    )
}