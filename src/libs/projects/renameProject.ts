import * as config from '../../assets/config.json';

export const renameProject = (id: string, newName: string, callback?: any) => {
  fetch(`${config['feeneyRootAPI']}addons/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      projectName: newName,
    }),
  }).then(() => {
    callback();
  });
};
