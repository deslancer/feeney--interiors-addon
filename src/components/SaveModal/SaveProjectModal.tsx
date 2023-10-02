import Modal from '../Modal/Modal';
import { useFeeneyStore } from '../../libs/store/store';
import { useState } from 'react';
import { saveProject } from '../../libs/projects/saveProject';

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveProjectModal(props: SaveProjectModalProps) {
  const { isOpen, onClose } = props;
  const { selectedScene } = useFeeneyStore();
  const [projectName, setProjectName] = useState<string>(
    'New Railing Design 1'
  );
  const handleSaveProject = () => {
    saveProject(projectName);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} width={'md:max-w-sm'} onClose={onClose}>
      <Modal.Header>Save Project</Modal.Header>
      <Modal.Body>
        <div className={'min-h-[40vh] flex'}>
          <div className={'flex flex-col w-full items-center'}>
            {selectedScene && (
              <div className={'mt-8 text-center italic'}>
                <img
                  className="mx-auto h-44 max-w-44  rounded-lg"
                  src={selectedScene.image}
                  alt={selectedScene.name}
                />
                <span className={'text-sm'}>
                  Selected <strong>{selectedScene.name}</strong> interior
                </span>
              </div>
            )}
            <div className={'w-64 mt-8'}>
              <span className={'font-bold text-center'}>Project Name:</span>
              <input
                type="text"
                name="project-name"
                className="form-custom-input"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div className={'mt-4 flex justify-evenly'}>
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="w-24 h-8 text-feeney_primary border border-feeney_primary cursor-pointer rounded bg-white mb-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProject}
                  className="w-24 h-8 text-white cursor-pointer rounded bg-feeney_primary mb-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
