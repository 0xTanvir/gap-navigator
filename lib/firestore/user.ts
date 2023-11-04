import { getDoc, doc, setDoc } from "firebase/firestore"
import { Collections } from './client'
import { User } from '@/types/dto'

/// Users ///

// getUserById get an user by id
export async function getUserById(id: string): Promise<User> {
    if (!id) {
        return Promise.reject(Error(`No such user id: ${id}`))
    }

    const snap = await getDoc(doc(Collections.users, id))
    if (snap.exists()) {
        const data = snap.data()
        const user: User = {
            uid: snap.id,
            fullName: data.fullName,
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
    try {
        const docRef = doc(Collections.users, id)
        await setDoc(docRef, user)
    } catch (error) {
        return Promise.reject(error)
    }
}
