import { getDatabase, onValue, ref, set, update } from "firebase/database"
import { Notification } from "@/types/dto";

const db = getDatabase();

export async function setNotificationData(userId: string, notificationData: Notification) {
    try {
        const userNotificationsRef = ref(db, `root/audit-notifications/${userId}/notifications/` + notificationData.uid);
        const userNotificationsAlert = ref(db, `root/audit-notifications/${userId}/`);

        // Set the custom data using the generated UID under the user's notifications
        await set(userNotificationsRef, notificationData);

        // Update notificationAlert to true
        await update(userNotificationsAlert, {notificationAlert: true});

        return true;
    } catch (error) {
        throw new Error("Error notification data");
    }
}

export async function updateNotificationById(userId: string, notification: Notification) {
    try {
        const notificationRef = ref(db, `root/audit-notifications/${userId}/notifications/${notification.uid}`);

        // Update the notification with the provided data
        await update(notificationRef, {isSeen: true});

        return true;
    } catch (error) {
        throw new Error("Error updating notification");
    }
}

export async function updateNotificationsAlertById(userId: string) {
    try {
        const userNotificationsAlert = ref(db, `root/audit-notifications/${userId}/`);

        // Update notificationAlert to true
        await update(userNotificationsAlert, {notificationAlert: false});
        return true;
    } catch (error) {
        throw new Error("Error update Notifications Alert");
    }
}

export async function getNotificationById(userId: string): Promise<Notification [] | null> {
    try {
        const userNotificationsRef = ref(db, `root/audit-notifications/${userId}/notifications/`)

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

