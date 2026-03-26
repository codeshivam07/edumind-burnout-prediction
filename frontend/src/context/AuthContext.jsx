import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const GUEST_USER = {
  id: 'guest',
  name: 'Guest',
  email: 'guest@edumind.ai',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('edumind_token');
    const storedUser  = localStorage.getItem('edumind_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setIsGuest(false);
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('edumind_token', authToken);
    localStorage.setItem('edumind_user', JSON.stringify(userData));
  };

  // Guest — session only, nothing stored, no token
  const loginAsGuest = () => {
    setIsGuest(true);
    setUser(GUEST_USER);
    setToken('guest'); // non-null so isAuthenticated = true
    sessionStorage.setItem('edumind_guest', 'true');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsGuest(false);
    localStorage.removeItem('edumind_token');
    localStorage.removeItem('edumind_user');
    sessionStorage.removeItem('edumind_guest');
  };

  return (
    <AuthContext.Provider value={{
      user, token, isGuest,
      login, loginAsGuest, logout,
      loading,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
