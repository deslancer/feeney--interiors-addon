import { Project } from '../../types/Project';
import { openProject } from '../../libs/projects/openProject';
import { Edit3, Trash } from 'react-feather';
import { deleteProject } from '../../libs/projects/deleteProject';
import { renameProject } from '../../libs/projects/renameProject';
import { useEffect, useState } from 'react';

interface ProjectsListProps {
  projects: Project[];
  onClose: () => void;
  updateList: () => void;
}

export function ProjectsList(props: ProjectsListProps) {
  const { projects, onClose, updateList } = props;
  const [isInRenameState, setIsInRenameState] = useState<boolean[]>([]);
  const [newName, setNewName] = useState<string>();
  useEffect(() => {
    setIsInRenameState(new Array(projects.length).fill(false));
  }, [projects]);

  const handleOpenProject = (project: Project) => {
    openProject(project);
    onClose();
  };
  const handleRenameMode = (position: number) => {
    const updatedModeState = isInRenameState.map(
      (item: boolean, index: number) => (index === position ? !item : item)
    );
    setIsInRenameState(updatedModeState);
    console.log(updatedModeState);
  };
  const changeProjectName = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = evt.target;
    const name = value.slice(0, 20);
    setNewName(name);
  };
  const handleRenameProject = (project: Project) => {
    if (project.id) {
      renameProject(project.id, 'NewName', updateList);
    }
  };
  const handleDeleteProject = (project: Project) => {
    if (project.id) {
      deleteProject(project.id, updateList);
    }
  };
  return (
    <>
      {projects.length > 0 &&
        projects.map((project, index) => (
          <div className={' cursor-pointer '} key={index}>
            <figure
              onClick={() => handleOpenProject(project)}
              className={`text-center bg-[#F2F2F2] h-52 w-52 rounded-lg hover:border-2 border-feeney_primary flex flex-col`}
            >
              <img
                className="mx-auto h-48 max-w-48 rounded-lg"
                src={project.projectImg}
                alt={project.projectName}
              />
              <figcaption className={'w-full  text-center'}>
                <p>{project.projectName} </p>
              </figcaption>
            </figure>

            <div className={'flex gap-8 mt-2 mb-4 justify-center'}>
              <p onClick={() => handleRenameProject(project)}>
                <Edit3 color={'#68CEE7'} size={16} />
              </p>
              <p onClick={() => handleDeleteProject(project)}>
                <Trash color={'#A65200'} size={16} />
              </p>
            </div>
          </div>
        ))}
    </>
  );
}
