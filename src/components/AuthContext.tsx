import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import { User } from "@/actions/generated/client";
import { getSession } from "@/actions/users";

interface AuthContextType {
  session: Session | null;
  user: User | null; // Supabase user object
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (session: Session) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    async function getActiveSession() {
      setIsLoading(true); // Start loading
      try {
        const { data : session, errorMessage } = await getSession();
        if (errorMessage || !session) {
          return
        }
        setSession(session as Session);
        setIsLoggedIn(true);
        setUser(session?.user as unknown as User);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false); // End loading
      }
    }

    getActiveSession();
  }, []);

  const login = (session: Session) => {
    setIsLoggedIn(true);
    setSession(session);
  };

  const logout = async () => {
    setIsLoggedIn(false)
    setSession(null)
  };

  const value: AuthContextType = {
    session,
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
