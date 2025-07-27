
"use client";

import { useState, createContext, useContext, ReactNode } from 'react';
import type { User } from 'firebase/auth';

// Define a mock user structure that matches Firebase's User object partially
const mockUser: User = {
  uid: 'mock-user-id',
  email: 'commander@example.com',
  displayName: 'Event Commander',
  photoURL: null,
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  // Add other methods as empty functions to prevent runtime errors
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({ token: 'mock-token', claims: {}, authTime: '', expirationTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null }),
  reload: async () => {},
  delete: async () => {},
  toJSON: () => ({}),
  providerId: 'mock'
};


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
  loginWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User | null>(mockUser);
  const [loading] = useState(false);

  const value: AuthContextType = {
    user,
    loading,
    login: async () => console.log("Login disabled"),
    signup: async () => console.log("Signup disabled"),
    logout: async () => console.log("Logout disabled"),
    updateUserProfile: async () => console.log("Update profile disabled"),
    loginWithGoogle: async () => console.log("Google login disabled"),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
