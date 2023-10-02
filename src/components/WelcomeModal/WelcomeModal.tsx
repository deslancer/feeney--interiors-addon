import Modal from '../Modal/Modal';
import { useState } from 'react';

import { InteriorsList } from './InteriorsList';
import { useFeeneyStore } from '../../libs/store/store';
import { ProjectsList } from './ProjectsList';
import * as config from '../../assets/config.json';

export interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal(props: WelcomeModalProps) {
  const [tabState, setTabState] = useState(1);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const { authenticated, user } = useFeeneyStore();
  const { isOpen, onClose } = props;

  async function getUserProjects() {
    const resp = await fetch(`${config['feeneyRootAPI']}addons/`);
    const projects = await resp.json();
    if (projects && user) {
      const filtered = projects.filter(
        (project: any) => project.userId === user.id
      );
      setUserProjects(filtered);
    }
  }

  const toggleTab = async (index: number) => {
    setTabState(index);
    if (index === 2) {
      await getUserProjects();
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      width={'md:max-w-4xl'}
      onClose={onClose}
      staticBackdrop={false}
    >
      <Modal.Header>Start a New Project with</Modal.Header>
      <Modal.Body>
        <div className={'min-h-[60vh]'}>
          <div
            className={
              'flex w-full border cursor-pointer border-feeney_highlight'
            }
          >
            <div
              onClick={() => toggleTab(1)}
              className={`text-center transition-all duration-300  p-5 basis-1/2 ${
                tabState === 1 ? 'font-bold text-white bg-feeney_primary' : ''
              } `}
            >
              Select Interior
            </div>
            {authenticated && (
              <div
                onClick={() => toggleTab(2)}
                className={`text-center transition-all duration-300 p-5 basis-1/2 ${
                  tabState === 2 ? 'font-bold text-white bg-feeney_primary' : ''
                }`}
              >
                My Projects
              </div>
            )}
          </div>
          <div
            className={`${
              tabState === 1 ? 'flex' : 'hidden'
            } transition-all duration-300`}
          >
            <InteriorsList onClose={onClose} />
          </div>
          <div
            className={`${
              tabState === 2 ? 'grid' : 'hidden'
            } transition-all duration-300 p-4  w-full grid-cols-3 md:grid-cols-4 gap-2`}
          >
            <ProjectsList
              projects={userProjects}
              onClose={onClose}
              updateList={() => getUserProjects()}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
