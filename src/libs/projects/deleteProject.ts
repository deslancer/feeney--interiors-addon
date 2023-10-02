import * as config from '../../assets/config.json';

export const deleteProject = (id: string, callback?: any) => {
  fetch(`${config['feeneyRootAPI']}addons/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: null,
  }).then((r) => {
    callback();
  });
};
