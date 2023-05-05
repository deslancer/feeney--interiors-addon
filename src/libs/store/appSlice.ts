import { StateCreator } from 'zustand';
import { StoreSlices } from './store';
import type { Scene } from "babylonjs";
import { Project } from "../../types/Project";
import { AssetsLoader } from "../logic/assetsLoader";


export interface AppSlice {
    isInDevMode: boolean;
    setIsInDevMode: (isInDevMode: boolean) => void;
    scene: Scene | undefined;
    setScene: (scene: Scene) => void;
    project: Array<Project> | null;
    setProject: (project: Array<Project>) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    progress: number;
    setProgress: (progress: number) => void;
    cameraMode: string;
    setCameraMode: (cameraMode: string) => void;
    assetsLoader: AssetsLoader | undefined;
    setAssetsLoader: (assetsLoader: AssetsLoader) => void
}

export const createAppSlice: StateCreator<
    StoreSlices,
    [ [ 'zustand/persist', unknown ] ],
    [],
    AppSlice
> = (set) => ({
    isInDevMode: true,
    setIsInDevMode: (isInDevMode) =>
        set((state: any) => ({
            ...state,
            isInDevMode,
        })),
    scene: undefined,
    setScene: (scene) =>
        set((state: any) => ({
            ...state,
            scene,
        })),
    project: null,
    setProject: (project) =>
        set((state: any) => ({
            ...state,
            project,
        })),
    isLoading: false,
    setIsLoading: (isLoading) =>
        set((state: any) => ({
            ...state,
            isLoading,
        })),
    progress: 0,
    setProgress: (progress) =>
        set((state: any) => ({
            ...state,
            progress,
        })),
    cameraMode: "FPS",
    setCameraMode: (cameraMode) =>
        set((state: any) => ({
            ...state,
            cameraMode,
        })),
    assetsLoader: undefined,
    setAssetsLoader: (assetsLoader) =>
        set((state: any) => ({
            ...state,
            assetsLoader,
        })),
});
