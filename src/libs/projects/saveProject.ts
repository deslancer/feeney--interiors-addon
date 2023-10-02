import * as config from '../../assets/config.json';
import { gatherDataForPayload } from '../data/gatherDataForPayload';
import { useFeeneyStore } from '../store/store';

export const saveProject = (projectName: string) => {
  const { setProject } = useFeeneyStore.getState();
  fetch(`${config['feeneyRootAPI']}addons/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: gatherDataForPayload(projectName),
  })
    .then((res) => res.json())
    .then((project) => {
      console.log(project);
      setProject(project);
    });
};
