import React, { useEffect, useRef } from 'react';
import { createApp3D } from '../../libs/scene3d/app3D';
import { useFeeneyStore } from '../../libs/store/store';
import { useSceneInspector } from '../../libs/scene3d/scene-inspector';
import Preloader from '../Preloader/Preloader';
import { AppScene } from '../../libs/scene3d/scene';

export function RenderCanvas() {
  const {
    scene,
    setScene,
    isInDevMode,
    setIsInDevMode,
    isLoading,
    setIsLoading,
    progress,
    selectedScene,
    setRebuild,
  } = useFeeneyStore(
    ({
      scene,
      setScene,
      isInDevMode,
      setIsInDevMode,
      isLoading,
      setIsLoading,
      progress,
      selectedScene,
      setRebuild,
    }) => ({
      scene,
      setScene,
      isInDevMode,
      setIsInDevMode,
      isLoading,
      setIsLoading,
      progress,
      selectedScene,
      setRebuild,
    })
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleKeyPress = (evt: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (evt.key == 'i') {
      if (scene) {
        setIsInDevMode(!isInDevMode);
        useSceneInspector(scene, isInDevMode);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    const getSelectedScene = useFeeneyStore.subscribe(
      (state) => state.selectedScene,
      (scene3D) => {
        if (!canvas) {
          console.warn('canvas undefined');
          return;
        }

        if (scene3D) {
          const appScene = new AppScene();
          appScene.clear();
          setIsLoading(true);
          createApp3D(canvas, scene3D.url)
            .then((scene) => {
              if (scene) {
                setScene(scene);
                setRebuild(true);
              }
            })
            .catch(console.log);
        }
      },
      {
        fireImmediately: true,
      }
    );
    getSelectedScene();
  }, [selectedScene]);

  return (
    <>
      {isLoading && <Preloader progress={progress} />}
      <canvas
        onKeyDown={(e) => handleKeyPress(e)}
        ref={canvasRef}
        id="renderCanvas"
        className={'w-full h-full'}
      ></canvas>
    </>
  );
}
