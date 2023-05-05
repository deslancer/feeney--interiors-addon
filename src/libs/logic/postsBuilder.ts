import { MeshAssetTask, Mesh } from "babylonjs";

export class PostsBuilder {
    private allPosts: Mesh[] = [];
    constructor() {
    }

    build(postTask: MeshAssetTask | undefined) {
        if (postTask){
            postTask.onSuccess = (task) => {
                console.log(task.loadedMeshes)
            }
            postTask.onError = (task, message, exception) => {
                console.log(message, exception);
            };
        }
    }

    remove() {

    }
}