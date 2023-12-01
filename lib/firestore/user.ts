import { getDoc, getDocs, setDoc } from "firebase/firestore"
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
            audits: data.audits
        }
        return user
    } else {
        return Promise.reject(Error(`No such user: ${id}`))
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
