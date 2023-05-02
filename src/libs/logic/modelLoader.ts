import { SceneLoader, Node } from "babylonjs";
import { useFeeneyStore } from "../store/store";
import 'babylonjs-loaders';
import { ProductEntity } from "../../types/productEntity";

export async function loadModel(entity: ProductEntity){
    const { scene } = useFeeneyStore.getState();
    if (entity){
        console.log(entity.modelObj)
    }
}