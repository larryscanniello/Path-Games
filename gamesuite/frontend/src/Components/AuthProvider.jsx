import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if access token exists / is valid (e.g., from localStorage)
    const token = localStorage.getItem('access_token');
    console.log('token: ',token)
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