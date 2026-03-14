import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const forceStop = window.setTimeout(() => {
        setLoading(false);
      }, 3500);

      const savedGoogleUser = localStorage.getItem('google_user');
      if (savedGoogleUser) {
        setUser(JSON.parse(savedGoogleUser) as User);
        window.clearTimeout(forceStop);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await api.get('/auth/profile', { timeout: 3000 });
          setUser(res.data.data);
        } catch (error) {
          localStorage.removeItem('access_token');
        }
      }
      window.clearTimeout(forceStop);
      setLoading(false);
    };

    initAuth();

    // Listen for unauthorized events to logout automatically
    const handleUnauthorized = () => {
      localStorage.removeItem('access_token');
      setUser(null);
      navigate('/login');
    };
    window.addEventListener('unauthorized', handleUnauthorized);

    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate]);

  const login = async (token: string) => {
    setLoading(true);
    localStorage.setItem('access_token', token);
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.data);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to load profile');
      localStorage.removeItem('access_token');
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const mappedUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? 'unknown@example.com',
        name: firebaseUser.displayName ?? 'Google User',
        role: 'STAFF',
      };

      setUser(mappedUser);
      localStorage.setItem('google_user', JSON.stringify(mappedUser));
      localStorage.removeItem('access_token');
      toast.success('Signed in with Google');
      navigate('/');
    } catch (error) {
      toast.error('Google sign-in failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('google_user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
