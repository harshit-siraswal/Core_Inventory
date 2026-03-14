import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface AuthUser {
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AUTH_USER_KEY = "core_inventory_auth_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.email) {
          setUser(parsed);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const mappedUser: AuthUser = {
      email: normalizedEmail,
      name: normalizedEmail.split("@")[0] || "User",
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mappedUser));
    setUser(mappedUser);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  const loginWithGoogle = async () => {
    const mappedUser: AuthUser = {
      email: "google.user@example.com",
      name: "Google User",
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mappedUser));
    setUser(mappedUser);
  };

  const value = useMemo(
    () => ({ user, loading, login, loginWithGoogle, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
