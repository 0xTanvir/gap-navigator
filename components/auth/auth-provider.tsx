import { useContext, createContext, FC, useState, ReactNode, useEffect } from 'react'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import auth from 'firebase/auth'
import { firebaseAuth } from '@/firebase'
import { useRouter, usePathname } from "next/navigation"

interface AuthContextValue {
    // Change this user to session user
    user: auth.User | null
    // isAuthenticated: boolean
    // isRegistered: boolean
    loading: boolean
    logOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, logOut: async () => { } })

export const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<auth.User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    const logOut = async () => {
        await signOut(firebaseAuth)
        setUser(null)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) {
                setLoading(false)
                // Instead of set user set isAuthenticated
                setUser(currentUser)
                // TODO: check if user role is available in local
                // if role is not available, then fetch from firestore
                // if role is available, then do nothing

                // if firestore has no result, redirect user to complete profile
                // with currentUser uid

                // console.log("current path name:", pathname)
                // if (pathname !== "/register-new") {
                //     router.push("/register-new")

                //     // You are authenticated, but you are not registered
                //     // You need to register first to continue
                //     // You will be redirected to register page
                // }

                // if firestore has result, then set this user
                // console.log("I am getting call currentUser:", currentUser)

            } else {
                setLoading(false)
                setUser(null)
            }
        })
        return unsubscribe
    }, [])

    return <AuthContext.Provider value={{ user, loading, logOut }}>{children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext)
