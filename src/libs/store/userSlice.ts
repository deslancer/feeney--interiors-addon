import { StateCreator } from 'zustand';
import { StoreSlices } from './store';

interface UserData {
  confirmPassword: 'string';
  country: 'string';
  email: 'string';
  firstName: 'string';
  id: 'string';
  lastName: 'string';
  phone: 'string';
  stateProvince: 'string';
  userType: 'string';
}

export interface UserSlice {
  authenticated: boolean;
  setAuthentication: (authenticated: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: { name: string; message: string; status: number } | null;
  setError: (error: { name: string; message: string; status: number }) => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
}

export const createUserSlice: StateCreator<
  StoreSlices,
  [['zustand/persist', unknown]],
  [],
  UserSlice
> = (set) => ({
  authenticated: false,

  setAuthentication: (authenticated) =>
    set((state: any) => ({
      ...state,
      authenticated,
    })),

  loading: true,

  setLoading: (loading) =>
    set((state: any) => ({
      ...state,
      loading,
    })),

  error: null,

  setError: (error) =>
    set((state: any) => ({
      ...state,
      error,
    })),

  user: null,

  setUser: (user) =>
    set((state: any) => ({
      ...state,
      user,
    })),
  accessToken: '',
  setAccessToken: (accessToken) =>
    set((state: any) => ({
      ...state,
      accessToken,
    })),
});
