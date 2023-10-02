import Dropdown from '../Dropdown/Dropdown';
import {
  Camera,
  HelpCircle,
  LogIn,
  Save,
  Settings,
  Sun,
  User,
} from 'react-feather';
import { useState } from 'react';
import { useFeeneyStore } from '../../libs/store/store';
import { takeScreenshot } from '../../libs/scene3d/takeScreenshot';
import { SignModal } from '../SignModal/SignModal';
import { disableDynamicSky } from '../../libs/scene3d/environment';
import { SaveProjectModal } from '../SaveModal/SaveProjectModal';
import { signOut } from '../SignModal/signOut';

export function Toolbar() {
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

  const {
    setCameraMode,
    scene,
    authenticated,
    dynamicSky,
    setDynamicSky,
    user,
  } = useFeeneyStore();
  const changeCameraMode = () => {
    setIsChecked(!isChecked);
    if (scene) {
      const orthoCamera = scene.getCameraByName('orthoCamera');
      const fpsCamera = scene.getCameraByName('FPSCamera');

      if (isChecked) {
        setCameraMode('orthographic');
        scene.activeCamera = orthoCamera;
        fpsCamera?.detachControl();
      } else {
        setCameraMode('FPS');
        fpsCamera?.attachControl(true);
        scene.activeCamera = fpsCamera;
      }
    }
  };
  const createScreenshot = () => {
    takeScreenshot();
  };
  const toggleDynamicSky = () => {
    setDynamicSky(!dynamicSky);
    disableDynamicSky();
  };
  const handleSaveProject = () => {
    if (authenticated) {
      setIsSaveModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div
      className={
        'absolute h-10 flex items-center rounded-md text-white top-[3.5rem] right-[1.5rem] bg-feeney_secondary_dark'
      }
    >
      <div className={'border-r border-feeney_highlight'}>
        {authenticated && (
          <Dropdown variant="dark" menuAnchor="right">
            <Dropdown.Button>My Projects</Dropdown.Button>
            <Dropdown.Menu>
              <Dropdown.Item hotkey="">Share</Dropdown.Item>
              <Dropdown.Item hotkey="">Snapshots</Dropdown.Item>
              <Dropdown.Separator></Dropdown.Separator>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      <div className={'flex items-center px-3'}>
        <span className="font-medium">2D</span>
        <label className="relative mx-3 inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            onChange={changeCameraMode}
            checked={isChecked}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#EDEDED] rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-feeney_primary after:border-feeney_primary after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
        <span className="font-medium">3D</span>
      </div>

      <ul className={'flex gap-6 px-3 border-l  border-feeney_highlight'}>
        <li
          className={
            'cursor-pointer transition-all duration-500 hover:text-feeney_primary'
          }
          onClick={handleSaveProject}
        >
          <Save />
        </li>
        <li
          className={
            'cursor-pointer transition-all duration-500 hover:text-feeney_primary'
          }
          onClick={createScreenshot}
        >
          <Camera />
        </li>
        <li
          className={
            'cursor-pointer transition-all duration-500 hover:text-feeney_primary'
          }
          onClick={toggleDynamicSky}
        >
          <Sun />
        </li>
        <li
          className={
            'cursor-pointer transition-all duration-500 hover:text-feeney_primary'
          }
        >
          <Settings />
        </li>
        <li
          className={
            'cursor-pointer transition-all duration-500 hover:text-feeney_primary'
          }
        >
          <HelpCircle />
        </li>
      </ul>
      {authenticated && user ? (
        <div className={'border-l border-feeney_highlight'}>
          <Dropdown variant="dark" menuAnchor="right">
            <Dropdown.Button>
              <User />
            </Dropdown.Button>
            <Dropdown.Menu>
              <Dropdown.Item action={() => alert('test')} hotkey="">
                {user.firstName} &nbsp; {user.lastName}
              </Dropdown.Item>
              <Dropdown.Separator></Dropdown.Separator>
              <Dropdown.Item action={() => signOut()} hotkey="">
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : (
        <div
          className={
            'cursor-pointer transition-all duration-500 hover:text-feeney_primary pr-4'
          }
          onClick={() => setIsLoginModalOpen(true)}
        >
          <LogIn />
        </div>
      )}
      <SignModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <SaveProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </div>
  );
}
