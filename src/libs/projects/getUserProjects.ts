import * as config from '../../assets/config.json';
import { useFeeneyStore } from '../store/store';

export const getUserProjects = async () => {
  const { user } = useFeeneyStore.getState();
  const resp = await fetch(`${config['feeneyRootAPI']}addons/`);
  const projects = await resp.json();
  if (projects && user) {
    return projects.filter((project: any) => project.userId === user.id);
  }
};
