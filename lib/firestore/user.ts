import { getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { Collections } from './client'
import { User } from '@/types/dto'

/// Users ///

// TODO: instead of promise reject throw error
// getUserById get an user by id
export async function getUserById(id: string): Promise<User> {
    if (!id) {
        return Promise.reject(Error(`No such user id: ${id}`))
    }

    const userDocRef = Collections.user(id)
    const snap = await getDoc(userDocRef)
    if (snap.exists()) {
        const data = snap.data()
        const user: User = {
            uid: snap.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            image: data.image,
            audits: data.audits,
            invitedAuditsList: data.invitedAuditsList === undefined ? [] : data.invitedAuditsList
        }
        return user
    } else {
        return Promise.reject(Error(`No such user: ${id}`))
    }
}

export async function getUserByIds(usersId: string[]): Promise<User[]> {
    if (usersId.length > 0) {
        const usersCollectionRef = Collections.users();
        const q = query(usersCollectionRef, where("uid", "in", usersId));

        const querySnapshot = await getDocs(q);

        // If no audits are found, return an empty array instead of rejecting.
        if (querySnapshot.empty) {
            return [];
        }
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                uid: doc.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
                image: data.image,
                audits: data.audits,
                invitedAuditsList: data.invitedAuditsList === undefined ? [] : data.invitedAuditsList
            } as User;
        })
    } else {
        return [];
    }
}

export async function getUserByEmail(email: string): Promise<User> {
    const userDocRef = Collections.users()
    try {
        const querySnapshot = await getDocs(userDocRef);

        let user: User | null = {
            uid: '',
            firstName: '',
            lastName: '',
            email: '',
            role: '',
            image: '',
            audits: [],
            invitedAuditsList: [],
        };

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.email === email) {
                user = {
                    uid: doc.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    role: data.role,
                    image: data.image,
                    audits: data.audits,
                    invitedAuditsList: data.invitedAuditsList === undefined ? [] : data.invitedAuditsList,
                };
            }
        });
        return user;
    } catch (error) {
        throw new Error('Error getting user');
    }
}

// setUser take UserDto object set it on db
export async function setUser(id: string, user: User) {
    const userDocRef = Collections.user(id)
    try {
        await setDoc(userDocRef, user)
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function updateUserProfile(id: string, formData: object) {
    const userDocRef = Collections.user(id);
    try {
        await updateDoc(userDocRef, formData)
        // Retrieve the updated user data after the update
        const updatedDocSnapshot = await getDoc(userDocRef);
        return updatedDocSnapshot.data() as User
    } catch (error) {
        throw new Error("Error updating user profile")
    }
}

export async function updateUserById(userId: string, userData: User) {
    const userRef = Collections.user(userId)
    try {
        await updateDoc(userRef, {...userData})
        return true
    } catch (error) {
        throw new Error("Error updating user information")
    }
}
