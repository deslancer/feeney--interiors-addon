import { Project } from '../../types/Project';
import * as config from '../../assets/config.json';

export const getProjectById = async (id: string): Promise<Project> => {
  const resp = await fetch(`${config['feeneyRootAPI']}addons/${id}`);
  return await resp.json();
};
