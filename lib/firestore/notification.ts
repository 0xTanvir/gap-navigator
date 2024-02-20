import { getDatabase, onValue, ref, set, update, get, remove } from "firebase/database"
import { Notification } from "@/types/dto";

const db = getDatabase();
export async function setNotificationData(userId: string, notificationData: Notification) {
  try {
    const userNotificationsRef = ref(db, `root/audit-notifications/${userId}/notifications/` + notificationData.auditId);
    const userNotificationsAlert = ref(db, `root/audit-notifications/${userId}/`);

    const allNotification: Notification[] = [];
    onValue(ref(db, `root/audit-notifications/${userId}/notifications/`), (snapshot) => {
      const snapshotVal = snapshot.val();
      if (snapshot.exists() && snapshotVal) {
        const values = Object.values(snapshotVal);

        // Filter out null entries and append them to allNotification
        const validNotifications = values.filter((item): item is Notification => item !== null);
        allNotification.push(...validNotifications);
      }
    });

    // Check if the notification with the given uid already exists
    const existingNotification = allNotification.find(notification => notification.auditId === notificationData.auditId);

    if (existingNotification) {
      // If the notification exists, update it
      if (existingNotification.isSeen) {
        const existingNotificationRef = ref(db, `root/audit-notifications/${userId}/notifications/` + existingNotification.auditId);
        await update(existingNotificationRef, {isSeen: false});
      }
    } else {
      // If the notification doesn't exist, add a new one
      await set(userNotificationsRef, notificationData);
    }

    // Check if notificationAlert is currently false before updating
    const snapshotAlert = await get(userNotificationsAlert);
    const currentNotificationAlert = snapshotAlert.val()?.notificationAlert;

    if (currentNotificationAlert === false) {
      // Update notificationAlert to true only if it's currently false
      await update(userNotificationsAlert, {notificationAlert: true});
    }

    return true;
  } catch (error) {
    throw new Error("Error notification data");
  }
}

export async function updateNotificationById(userId: string, notification: Notification) {
  try {
    const notificationRef = ref(db, `root/audit-notifications/${userId}/notifications/${notification.auditId}`);

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

export async function getNotificationById(userId: string): Promise<Notification [] | []> {
  try {
    const userNotificationsRef = ref(db, `root/audit-notifications/${userId}/notifications/`)

    return new Promise((resolve) => {
      onValue(userNotificationsRef, (snapshot) => {
        const notifications: Notification[] | [] = (snapshot.exists() ? Object.values(snapshot.val()) : []);
        resolve(notifications);
      });
    });

  } catch (err) {
    throw new Error("Error getting notifications")
  }
}

export async function deleteNotificationsAlertById(userId: string, auditId: string): Promise<boolean> {
  try {
    const notificationsRef = ref(db, `root/audit-notifications/${userId}/notifications/`);
    const snapshot = await get(notificationsRef);
    if (!snapshot.exists()) {
      throw new Error(`No notifications found for user ${userId}.`);
    }
    const notifications: Notification = snapshot.val();
    let notificationKeyToDelete = null;

    // Iterate over the notification keys to find the one with the matching auditId
    for (const [key, notification] of Object.entries(notifications)) {
      if (notification.auditId === auditId) {
        notificationKeyToDelete = key;
        break;
      }
    }

    if (notificationKeyToDelete) {
      await remove(ref(db, `root/audit-notifications/${userId}/notifications/${notificationKeyToDelete}`));
      return true;
    } else {
      throw new Error(`Notification with auditId ${auditId} not found.`);
    }
  } catch (error) {
    throw new Error(`Error deleting notification: ${error}`);
  }
}

// export async function deleteNotificationsAlertById(userId: string, auditId: string): Promise<boolean> {
//   try {
//     const notificationsRef = ref(db, `root/audit-notifications/${userId}/notifications/`);
//     const snapshot = await get(notificationsRef);
//     const data: Notification[] = Object.values(snapshot.val()) || [];
//
//     const notificationToDelete = data.find(notification => notification.auditId === auditId);
//
//     if (notificationToDelete) {
//       await remove(ref(db, `root/audit-notifications/${userId}/notifications/${notificationToDelete.auditId}`));
//       return true;
//     } else {
//       throw new Error(`Notification with auditId ${auditId} not found.`);
//     }
//   } catch (error) {
//     throw new Error(`Error deleting notification: ${error}`);
//   }
// }

