import { MeshAssetTask, Mesh, Vector3, Node, Scene } from "babylonjs";
import { useFeeneyStore } from "../store/store";
import { useSceneInspector } from "../scene3d/scene-inspector";

export class PostsBuilder {
    private allPosts: Mesh[] = [];
    private static _instance: PostsBuilder;
    /**
     * The instance function is a property getter that creates and caches a singleton instance of the class.
     *
     * @return The singleton instance of the class
     *
     */
    public static get instance(): PostsBuilder {
        if (this._instance == null) {
            this._instance = new PostsBuilder();
        }
        return this._instance;
    }
    private readonly scene: Scene | undefined = undefined;
    constructor() {
        this.scene = useFeeneyStore.getState().scene
    }

    build(
        postTask: MeshAssetTask | undefined,
        cornerPostTask: MeshAssetTask | undefined,
        positions: Record<string, Vector3>) {

        if (postTask && cornerPostTask){
            postTask.onSuccess = (task) => {
                const firstPost = task.loadedMeshes.find(node => node.name.includes('root'));
                if (firstPost) {
                    const lastPost = firstPost.clone('LastPost',null);
                    firstPost.name = 'Post_00';
                    firstPost.position = positions.firstPost;

                    if (lastPost){
                        lastPost.position = positions.lastPost;
                    }

                }

            }
            postTask.onError = (task, message, exception) => {
                console.log(message, exception);
            };

            cornerPostTask.onSuccess = (task) => {
                const cornerPost = task.loadedMeshes.find(node => node.name.includes('root'));
                console.log(positions)
                if (cornerPost) {
                    cornerPost.name = 'CornerPost_00';
                    cornerPost.position = positions.cornerPost;
                }
            }
            cornerPostTask.onError = (task, message, exception) => {
                console.log(message, exception);
            };
        }
    }

    remove() {

    }
}