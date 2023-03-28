import { createJSONStorage, persist } from 'zustand/middleware';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

import { createUserSlice, UserSlice } from './userSlice';
import { AppSlice, createAppSlice } from "./appSlice";

export type StoreSlices = UserSlice & AppSlice;

export const useFeeneyStore = create<StoreSlices>()(
    persist(
        (...a) => ({
            ...createUserSlice(...a),
            ...createAppSlice(...a),
        }),
        {
            name: 'feeney-data', // name of item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
            partialize: (state) => ({
                user: state.user,
                project: state.project
            }),
        },
    ),
);

const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === 'development') {
    mountStoreDevtool('feeneyStore', useFeeneyStore);
}
