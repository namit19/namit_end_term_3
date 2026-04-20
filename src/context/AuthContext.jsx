import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem('smartPlannerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    signUp: async (email, password, displayName) => {
      // Simulate network request
      await new Promise(r => setTimeout(r, 600));
      const mockUser = { id: crypto.randomUUID(), email, display_name: displayName };
      localStorage.setItem('smartPlannerUser', JSON.stringify(mockUser));
      setUser(mockUser);
      return { data: mockUser, error: null };
    },
    signIn: async (email, password) => {
      // Simulate network request
      await new Promise(r => setTimeout(r, 600));
      if (password.length < 6) {
        return { data: null, error: { message: "Password must be at least 6 characters" } };
      }
      const mockUser = { id: crypto.randomUUID(), email, display_name: email.split('@')[0] };
      localStorage.setItem('smartPlannerUser', JSON.stringify(mockUser));
      setUser(mockUser);
      return { data: mockUser, error: null };
    },
    signOut: async () => {
      await new Promise(r => setTimeout(r, 300));
      localStorage.removeItem('smartPlannerUser');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
