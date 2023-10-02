import { useFeeneyStore } from '../../libs/store/store';
import { Scene3D } from '../../types/Scene3D';

export interface InteriorsListProps {
  onClose: () => void;
}

export function InteriorsList(props: InteriorsListProps) {
  const { appData, setSelectedScene, selectedScene, setSceneMetaData } =
    useFeeneyStore();
  const scenes = appData ? JSON.parse(appData[0].scene3d) : null;
  const selectScene = (scene: Scene3D) => {
    if (scene) {
      setSelectedScene(scene);
      if (scene.metadata) {
        setSceneMetaData(JSON.parse(scene.metadata));
      }
      props.onClose();
    }
  };
  return (
    <div className={'p-4'}>
      <div className="grid w-full grid-cols-3 md:grid-cols-4 gap-4">
        {scenes &&
          scenes.map((scene: Scene3D, index: number) => (
            <div
              className={'cursor-pointer'}
              onClick={() => selectScene(scene)}
              key={index}
            >
              <figure
                className={`text-center bg-[#F2F2F2] h-52 w-52 rounded-lg flex flex-col border-feeney_primary
                 hover:border-2
                        ${
                          selectedScene && selectedScene.id == scene.id
                            ? 'border-2'
                            : ''
                        }`}
              >
                <img
                  className="mx-auto h-48 max-w-48 rounded-lg"
                  src={scene.image}
                  alt={scene.name}
                />
                <figcaption className={'w-full  text-center'}>
                  <span>{scene.name ? scene.name : 'Scene_' + index} </span>
                </figcaption>
              </figure>
            </div>
          ))}
      </div>
    </div>
  );
}
