import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { User } from "@/actions/generated/client";
import { getSession, PublicSchemaUser } from "@/actions/users";

interface AuthContextType {
  user: User | null; // Supabase user(public schema) object
  isLoading: boolean;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<PublicSchemaUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    async function getActiveSession() {
      setIsLoading(true); // Start loading
      try {
        const { data : user, errorMessage } = await getSession();
        if (errorMessage || !user) {
          return
        }
        console.warn(user);
        setIsLoggedIn(true);
        setUser(user);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false); // End loading
      }
    }

    getActiveSession();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    setIsLoggedIn(false)
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    logout,
    login
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
