import { getDoc, setDoc, updateDoc } from "firebase/firestore"
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
        }
        return user
    } else {
        return Promise.reject(Error(`No such user: ${id}`))
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
        return true;
    }catch (error){
        throw new Error("Error updating user profile")
    }
}
