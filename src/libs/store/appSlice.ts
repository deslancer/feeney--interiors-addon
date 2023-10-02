import { StateCreator } from 'zustand';
import { StoreSlices } from './store';
import type { Scene } from 'babylonjs';
import { AppData, Scene3D } from '../../types';
import { Project } from '../../types/Project';

export interface AppSlice {
  isInDevMode: boolean;
  setIsInDevMode: (isInDevMode: boolean) => void;
  scene: Scene | undefined;
  setScene: (scene: Scene) => void;
  selectedScene: Scene3D | null;
  setSelectedScene: (selectedScene: Scene3D) => void;
  appData: Array<AppData> | null;
  setAppData: (project: Array<AppData>) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  cameraMode: string;
  setCameraMode: (cameraMode: string) => void;
  sceneMetaData: any;
  setSceneMetaData: (sceneMetaData: any) => void;
  isRailingBuilding: boolean;
  setIsRailingBuilding: (isRailingBuilding: boolean) => void;
  dynamicSky: boolean;
  setDynamicSky: (dynamicSky: boolean) => void;
  project: Project | null;
  setProject: (project: Project) => void;
}

export const createAppSlice: StateCreator<
  StoreSlices,
  [['zustand/persist', unknown]],
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
  appData: null,
  setAppData: (project) =>
    set((state: any) => ({
      ...state,
      appData: project,
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
  cameraMode: 'FPS',
  setCameraMode: (cameraMode) =>
    set((state: any) => ({
      ...state,
      cameraMode,
    })),
  sceneMetaData: '',
  setSceneMetaData: (sceneMetaData) =>
    set((state: any) => ({
      ...state,
      sceneMetaData,
    })),
  selectedScene: null,
  setSelectedScene: (selectedScene) =>
    set((state: any) => ({
      ...state,
      selectedScene,
    })),
  isRailingBuilding: false,
  setIsRailingBuilding: (isRailingBuilding) =>
    set((state: any) => ({
      ...state,
      isRailingBuilding,
    })),
  dynamicSky: true,
  setDynamicSky: (dynamicSky) =>
    set((state: any) => ({
      ...state,
      dynamicSky,
    })),
  project: null,
  setProject: (project) =>
    set((state: any) => ({
      ...state,
      project,
    })),
});
