import {
  useContext,
  createContext,
  FC,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { firebaseAuth } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";
import { getUserById } from "@/lib/firestore/user";
import { User } from "@/types/dto";

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  loggedOut: boolean;
  updateUser: (user: User | null) => void;
  logOut: () => Promise<void>;
  setLoggedOut: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: async () => {},
  isAuthenticated: false,
  loading: true,
  loggedOut: false,
  updateUser: (user: User | null) => {},
  logOut: async () => {},
  setLoggedOut: (value: boolean) => {},
});

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const updateUser = (user: User | null) => {
    setUser(user);
  };

  const logOut = async () => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
      setIsAuthenticated(false);
      setLoggedOut(true)
    } catch (e: any) {
      toast.error("Something went wrong.", {
        description: `Failed to fetch audits. Please try again. ${e.message}`,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        if (currentUser) {
          // user is authenticated, set isAuthenticated to true
          setIsAuthenticated(true);
          // check if user available in application state
          // at the beginning of the application, user will be null
          // then fetch the user from firestore
          if (!user) {
            try {
              const dbUser = await getUserById(currentUser.uid);
              setUser(dbUser);
            } catch (error) {
              // if authenticated user is not available in firestore
              // then redirect user to register page
              toast.info("Authenticated, but not registered", {
                description:
                  "You are authenticated, but you are not registered, you need to register first to continue. You will be redirected to register page.",
              });
              // also redirect with param like, name, email and uid
              // that found on currentUser
              if (pathname !== "/complete-profile") {
                router.push(
                  `/complete-profile?uid=${currentUser.uid}&email=${currentUser.email}&fullName=${currentUser.displayName}`
                );
              }
            }
          }

          // here means user is available in application state
          setLoading(false);
        } else {
          setLoading(false);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    );
    return unsubscribe;
  }, []);

  const setUserAsync = async (newUser: User | null) => {
    // You can perform additional async operations if needed
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: setUserAsync,
        isAuthenticated,
        loading,
        updateUser,
        logOut,
        loggedOut,
        setLoggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
