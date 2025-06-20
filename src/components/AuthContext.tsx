import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { getSession, PublicSchemaUser } from "@/actions/users";

interface AuthContextType {
  user: PublicSchemaUser | null; // Supabase user(public schema) object
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (user: PublicSchemaUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<PublicSchemaUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function getActiveSession() {
      setIsLoading(true); // Start loading
      try {
        const { data : user, errorMessage } = await getSession();
        if (errorMessage || !user) {
          return
        }
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

  const login = (user: PublicSchemaUser) => {
    setIsLoggedIn(true);
    setUser(user);
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
