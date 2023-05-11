import { StateCreator } from 'zustand';
import { StoreSlices } from './store';
import { Vector3 } from "babylonjs";

export interface RailingParamsSlice {
    railingType: string[];
    setRailingType: (railingType: string[]) => void;
    postMounting: string;
    setPostMounting: (postMounting: string) => void;
    cornerPosts: string;
    setCornerPosts: (cornerPosts: string) => void;
    railingHeight: string;
    setRailingHeight: (railingHeight: string) => void;
    topRail: string;
    setTopRail: (topRail: string) => void;
    topRailForStairs: string;
    setTopRailForStairs: (topRailForStairs: string) => void;
    infill: string;
    setInfill: (infill: string) => void;
    stairHandrail: string;
    setStairHandrail: (stairHandrail: string) => void;
    railingHeightForStairs: string;
    setRailingHeightForStairs: (railingHeightForStairs: string) => void;
    verticalPicketShapeType: string;
    setVerticalPicketShapeType: (verticalPicketShapeType: string) => void;
    verticalPicketColorName: string;
    setVerticalPicketColorName: (verticalPicketColorName: string) => void;
    lighting: {
        topRailLights: boolean,
        bottomRailLights: boolean,
        postAccentLights: boolean
    }
    setLighting: (lighting: { topRailLights: boolean, bottomRailLights: boolean, postAccentLights: boolean }) => void;
    placementPoints: Vector3[];
    setPlacementPoints: (placementPoints: Vector3[])=> void;
}

export const createRailingParamsSlice: StateCreator<
    StoreSlices,
    [['zustand/persist', unknown]],
    [],
    RailingParamsSlice
> = (set) => ({
    railingType: ["DesignRail"],
    setRailingType: (railingType) =>
        set((state: any) => ({
            ...state,
            railingType,
        })),
    postMounting: "Base Mount",
    setPostMounting: (postMounting) =>
        set((state: any) => ({
            ...state,
            postMounting,
        })),
    cornerPosts: "Single",
    setCornerPosts: (cornerPosts) =>
        set((state: any) => ({
            ...state,
            cornerPosts,
        })),
    railingHeight: "36",
    setRailingHeight: (railingHeight) =>
        set((state: any) => ({
            ...state,
            railingHeight,
        })),
    topRail: "200s",
    setTopRail: (topRail) =>
        set((state: any) => ({
            ...state,
            topRail,
        })),
    topRailForStairs: "200s",
    setTopRailForStairs: (topRailForStairs) =>
        set((state: any) => ({
            ...state,
            topRailForStairs,
        })),
    infill: "horizontalCableBaserail",
    setInfill: (infill) =>
        set((state: any) => ({
            ...state,
            infill,
        })),
    stairHandrail: "",
    setStairHandrail: (stairHandrail) =>
        set((state: any) => ({
            ...state,
            stairHandrail,
        })),
    railingHeightForStairs: "36",
    setRailingHeightForStairs: (railingHeightForStairs) =>
        set((state: any) => ({
            ...state,
            railingHeightForStairs,
        })),
    verticalPicketShapeType: "Square",
    setVerticalPicketShapeType: (verticalPicketShapeType) =>
        set((state: any) => ({
            ...state,
            verticalPicketShapeType,
        })),
    verticalPicketColorName: "Black",
    setVerticalPicketColorName: (verticalPicketColorName) =>
        set((state: any) => ({
            ...state,
            verticalPicketColorName,
        })),
    lighting: {
        topRailLights: false,
        bottomRailLights: false,
        postAccentLights: false
    },
    setLighting: (lighting) =>
        set((state: any) => ({
            ...state,
            lighting,
        })),
    placementPoints: [],
    setPlacementPoints: (placementPoints) =>
        set((state: any) => ({
            ...state,
            placementPoints,
        })),
});
