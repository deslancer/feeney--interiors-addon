import { StateCreator } from 'zustand';
import { StoreSlices } from './store';

export interface UserSlice {
  authenticated: boolean | null;
  setAuthentication: (authenticated: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: { name: string; message: string; status: number } | null;
  setError: (error: { name: string; message: string; status: number }) => void;
  user: any | null;
  setUser: (user: any) => void;
  users: object[];
}

export const createUserSlice: StateCreator<
  StoreSlices,
  [['zustand/persist', unknown]],
  [],
  UserSlice
> = (set) => ({
  authenticated: null,

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

  users: [],
});
