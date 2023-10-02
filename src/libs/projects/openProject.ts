import { Project } from '../../types/Project';
import { useFeeneyStore } from '../store/store';
import { Scene3D } from '../../types';
import { setParamsDependencies } from '../logic/paramsDependencies';

export const openProject = (project: Project) => {
  const store = useFeeneyStore.getState();
  const scenes: Scene3D[] =
    store.appData && JSON.parse(store.appData[0].scene3d);

  store.setProject(project);
  if (project.sceneId) {
    const passedScene = scenes.find((scene) => scene.id === project.sceneId);
    if (passedScene) {
      store.setSelectedScene(passedScene);
      store.setSceneMetaData(JSON.parse(passedScene.metadata));
      store.setRailingType(project.railing.railingType);
      store.setCornerPosts(project.railing.cornerPosts);
      store.setPostMounting(project.railing.postMounting);
      store.setRailingHeight(project.railing.railingHeight);
      store.setTopRail(project.railing.topRail);
      store.setInfill(project.railing.infill);
      store.setVerticalPicketShapeType(project.railing.verticalPicketShapeType);
      store.setVerticalPicketColorName(project.railing.verticalPicketColorName);
      setParamsDependencies();
    }
  }
};
