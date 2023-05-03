import { ProjectAssets } from "./ProjectAssets";

export type Project = {
    assets: Array<ProjectAssets>
    created_at: string
    description: string
    engine: string
    graph: string
    id: string
    name: string
    scene3d: string
    uidl: Array<any>
    updated_at: string
    user_id: string
}