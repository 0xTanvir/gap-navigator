import { getDatabase, onValue, ref, set, update } from "firebase/database"
import { Notification } from "@/types/dto";

const db = getDatabase();

export async function setNotificationData(userId: string, notificationData: Notification) {
    try {
        const userNotificationsRef = ref(db, `notifications/${userId}/` + notificationData.uid);
        // Set the custom data using the generated UID under the user's notifications
        await set(userNotificationsRef, notificationData);

        return true
    } catch (error) {
        throw new Error("Error setting notification data:");
    }
}

export async function updateNotificationById(userId: string, notification: Notification) {
    try {
        const notificationRef = ref(db, `notifications/${userId}/${notification.uid}`);

        // Update the notification with the provided data
        await update(notificationRef, {isSeen: true});

        return true;
    } catch (error) {
        throw new Error("Error updating notification");
    }
}

export async function getNotificationById(userId: string): Promise<Notification [] | null> {
    try {
        const userNotificationsRef = ref(db, `notifications/${userId}`)

        return new Promise((resolve) => {
            onValue(userNotificationsRef, (snapshot) => {
                const notifications: Notification[] | null = (snapshot.exists() ? Object.values(snapshot.val()) : null);
                resolve(notifications);
            });
        });

    } catch (err) {
        throw new Error("Error getting notifications")
    }
}

