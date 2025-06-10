import { createContext, useState, useEffect } from 'react';
import { ACCESS_TOKEN } from '../constants';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    // Check if access token exists / is valid (e.g., from localStorage)
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      setIsAuthorized(true); // optionally verify with backend
    }
  }, []);

  return (
    <AuthContext.Provider value={[ isAuthorized, setIsAuthorized ]}>
      {children}
    </AuthContext.Provider>
  );
}