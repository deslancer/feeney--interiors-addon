import React, { useEffect, useRef } from "react";
import { createApp3D } from "../../libs/scene3d/app3D";
import { useFeeneyStore } from "../../libs/store/store";
import { useSceneInspector } from "../../libs/scene3d/scene-inspector";
import Preloader from "../Preloader/Preloader";
import { AssetsLoader } from "../../libs/logic/assetsLoader";


export function RenderCanvas() {
    const {
        scene, setScene,
        isInDevMode, setIsInDevMode,
        project, setProject,
        isLoading, setIsLoading,
        progress,
        setAssetsLoader
    } = useFeeneyStore(
        ({
             scene, setScene,
             isInDevMode, setIsInDevMode,
             project, setProject,
             isLoading, setIsLoading,
             progress,
            setAssetsLoader
         }) => ({
            scene, setScene,
            isInDevMode, setIsInDevMode,
            project, setProject,
            isLoading, setIsLoading,
            progress,
            setAssetsLoader
        }))
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shouldSetup = useRef(true);
    const handleKeyPress = (evt: React.KeyboardEvent<HTMLCanvasElement>) => {

        if (evt.key == "i") {
            if (scene) {
                setIsInDevMode(!isInDevMode)
                useSceneInspector(scene, isInDevMode)
            }

        }
    }

    useEffect(() => {
        if (shouldSetup.current) {
            shouldSetup.current = false;
            const canvas = canvasRef.current;
  
            fetch("http://68.183.30.252:3030/api/v1/projects/getOne/Kxx32UHXyx6GfCkkTD8p1")
                .then((res) => res.json())
                .then((result) => {
                    setProject(result.data)
                })

            if (!canvas) {
                console.warn('canvas undefined');
                return;
            }
            if (Array.isArray(project)) {
                createApp3D(canvas, project[0].scene3d).then((scene)=>{
                    setScene(scene);
                    setAssetsLoader(AssetsLoader.instance)
                }).catch(console.log);
            }

        }
    }, []);


    return (
        <>
            {isLoading ?
                (<Preloader progress={progress}/>) :
                (<canvas
                    onKeyDown={(e) => handleKeyPress(e)}
                    ref={canvasRef}
                    id="renderCanvas"
                    className={"w-full h-full"}
                ></canvas>)
            }

        </>

    )
}