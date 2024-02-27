import { getDatabase, onValue, ref, set, update, get, remove } from "firebase/database"
import { Notification } from "@/types/dto";
import { limitToLast, query, Timestamp } from "firebase/firestore";

const db = getDatabase();

export async function setNotificationData(userId: string, notificationData: Notification) {
  try {
    const userNotificationsRef = ref(db, `root/gn-notifications/${userId}/notifications/` + notificationData.uid);
    const userNotificationsAlertRef = ref(db, `root/gn-notifications/${userId}/alert`);

    await set(userNotificationsRef, notificationData);
    // Check the current state of notificationAlert
    const snapshot = await get(userNotificationsAlertRef);
    if (snapshot.exists()) {
      const notificationAlert = snapshot.val().notificationAlert;
      // If notificationAlert is false, then update it to true
      if (!notificationAlert) {
        await update(userNotificationsAlertRef, {notificationAlert: true});
      }
    } else {
      // If there's no notificationAlert set, initialize it to true
      await update(userNotificationsAlertRef, {notificationAlert: true});
    }
    return true;
  } catch (error) {
    throw new Error("Error notification data");
  }
}

export async function updateNotificationById(userId: string, notification: Notification) {
  try {
    const notificationRef = ref(db, `root/gn-notifications/${userId}/notifications/${notification.uid}`);

    // Update the notification with the provided data
    await update(notificationRef, {status: true, updatedAt: Timestamp.now()});

    return true;
  } catch (error) {
    throw new Error("Error updating notification");
  }
}

export async function updateNotificationsAlertById(userId: string) {
  try {
    const userNotificationsAlert = ref(db, `root/gn-notifications/${userId}/alert`);

    // Update notificationAlert to true
    await update(userNotificationsAlert, {notificationAlert: false});
    return true;
  } catch (error) {
    throw new Error("Error update Notifications Alert");
  }
}

export async function getNotificationById(userId: string): Promise<Notification [] | []> {
  try {
    const userNotificationsRef = ref(db, `root/gn-notifications/${userId}/notifications/`)
    return new Promise((resolve) => {
      onValue(userNotificationsRef, (snapshot) => {
        const notifications: Notification[] | [] = (snapshot.exists() ? Object.values(snapshot.val()) : []);
        resolve(notifications.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
      });
    });

  } catch (err) {
    throw new Error("Error getting notifications")
  }
}
export async function getNavNotificationById(userId: string): Promise<Notification [] | []> {
  try {
    const userNotificationsRef = ref(db, `root/gn-notifications/${userId}/notifications/`)
    const notifications = await new Promise<Notification[] | []>((resolve, reject) => {
      onValue(userNotificationsRef, (snapshot) => {
        if (snapshot.exists()) {
          let notifications: Notification[] = Object.values(snapshot.val());
          notifications.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
          // Return only the last 3 notifications
          notifications = notifications.slice(0, 3);
          resolve(notifications);
        } else {
          resolve([]);
        }
      }, (error) => {
        reject(new Error("Error accessing notifications: " + error.message));
      });
    });
    return notifications;
  } catch (err) {
    throw new Error("Error getting notifications");
  }
}

export async function deleteNotificationsAlertById(userId: string, auditId: string): Promise<boolean> {
  try {
    const notificationsRef = ref(db, `root/gn-notifications/${userId}/notifications/`);
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
      await remove(ref(db, `root/gn-notifications/${userId}/notifications/${notificationKeyToDelete}`));
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

// Role Change Notification
export async function setRoleChangeNotification(userId: string, notificationData: Notification) {
  try {
    const notificationsRef = ref(db, `root/gn-notifications/${userId}/notifications/` + notificationData.uid);
    const notificationsAlertRef = ref(db, `root/gn-notifications/${userId}/alert`);

    await set(notificationsRef, notificationData);
    // Check the current state of notificationAlert
    const snapshot = await get(notificationsAlertRef);
    if (snapshot.exists()) {
      const notificationAlert = snapshot.val().notificationAlert;
      // If notificationAlert is false, then update it to true
      if (!notificationAlert) {
        await update(notificationsAlertRef, {notificationAlert: true});
      }
    } else {
      // If there's no notificationAlert set, initialize it to true
      await update(notificationsAlertRef, {notificationAlert: true});
    }
    return true;
  } catch (error) {
    throw new Error("Error notification data");
  }
}

// User Account Change Notification
export async function setUserStatusChangeNotification(userId: string, notificationData: Notification) {
  try {
    const notificationsRef = ref(db, `root/gn-notifications/${userId}/notifications/` + notificationData.uid);
    const notificationsAlertRef = ref(db, `root/gn-notifications/${userId}/alert`);

    await set(notificationsRef, notificationData);
    // Check the current state of notificationAlert
    const snapshot = await get(notificationsAlertRef);
    if (snapshot.exists()) {
      const notificationAlert = snapshot.val().notificationAlert;
      // If notificationAlert is false, then update it to true
      if (!notificationAlert) {
        await update(notificationsAlertRef, {notificationAlert: true});
      }
    } else {
      // If there's no notificationAlert set, initialize it to true
      await update(notificationsAlertRef, {notificationAlert: true});
    }
    return true;
  } catch (error) {
    throw new Error("Error notification data");
  }
}
