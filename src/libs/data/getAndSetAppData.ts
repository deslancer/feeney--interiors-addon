import { useFeeneyStore } from '../store/store';
import * as config from '../../assets/config.json';
import { getParamsFromURL } from './getParamsFromURL';
import { Scene3D } from '../../types';
import { getProjectById } from '../projects/getProjectById';
import { openProject } from '../projects/openProject';

export const getAndSetAppData = async () => {
  const {
    setAppData,
    setSelectedScene,
    setIsLoading,
    setSceneMetaData,
    setUser,
    setAuthentication,
    setAccessToken,
  }: any = useFeeneyStore.getState();
  setIsLoading(true);
  const params = getParamsFromURL();
  fetch(`${config['cmsAPI']}projects/getOne/${config['appID']}`)
    .then((res) => res.json())
    .then((result) => {
      setAppData(result.data);
      console.info('app data:', result.data);

      const scenes: Scene3D[] = JSON.parse(result.data[0].scene3d);

      if (params?.sceneId) {
        const passedScene = scenes.find((scene) => scene.id === params.sceneId);
        setSelectedScene(passedScene);
        if (passedScene) {
          setSceneMetaData(JSON.parse(passedScene.metadata));
        }
      }
      if (params?.userId && params.token) {
        fetch(
          `${config['feeneyRootAPI']}users/${params.userId}?access_token=${params.token}`
        )
          .then((res) => res.json())
          .then((result) => {
            console.info('user data:', result);
            setUser(result);
            setAuthentication(true);
            setAccessToken(params.token);
          });

        if (params.projectId) {
          getProjectById(params.projectId).then((project) => {
            console.log(project);
            openProject(project);
          });
        }
      }
      setIsLoading(false);
    });

  return {
    scene: params?.sceneId,
    project: params?.projectId,
  };
};
