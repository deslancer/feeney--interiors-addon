import { Scene } from "babylonjs";

export  function useSceneInspector(scene: Scene, isInDebugMode: boolean) {
    const debugLayer = scene.debugLayer;
    if (isInDebugMode){
        debugLayer.show({
            overlay: true,
            globalRoot: document.body
        }).then(()=> console.log("App in debug mode"));
    }else {
        debugLayer.hide()
        console.log("Debug mode has been closed")
    }

}