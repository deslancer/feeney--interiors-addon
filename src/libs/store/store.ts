import create from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";
import { createUserSlice, UserSlice } from "./userSlice";
import { AppSlice, createAppSlice } from "./appSlice";
import { createRailingParamsSlice, RailingParamsSlice } from "./railingParamsSlice";

export type StoreSlices = UserSlice & AppSlice & RailingParamsSlice;

export const useFeeneyStore = create<StoreSlices>()(
    subscribeWithSelector(
        persist( (...a) => ({
            ...createUserSlice(...a),
            ...createAppSlice(...a),
            ...createRailingParamsSlice(...a),
        }),{
            name: 'feeney-data', // name of item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
            partialize: (state) => ({
                user: state.user,
                project: state.project
            }),
        })
    )
);