import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Video,
} from 'react-feather';
import { MutableRefObject, useState } from 'react';
import { useFullscreen } from '../../hooks/useFullscreen';
import {
  changeCameraPosition,
  respawnCamera,
} from '../../libs/scene3d/cameras';
import { useFeeneyStore } from '../../libs/store/store';

interface BottomBarInterface {
  appElement: MutableRefObject<HTMLDivElement>;
}

export function BottomBar({ appElement }: BottomBarInterface) {
  const { inFullscreenMode, toggleFullscreen } = useFullscreen(appElement);
  const { sceneMetaData } = useFeeneyStore();
  const cameraPositions = sceneMetaData.cameraPositions;
  const [currentPosition, setCurrentPosition] = useState(1);

  const handleNextCameraPos = () => {
    if (currentPosition < cameraPositions.length - 1) {
      let increment = currentPosition + 1;
      setCurrentPosition(increment);
    } else {
      setCurrentPosition(0);
    }
    changeCameraPosition(currentPosition);
  };
  const handlePrevCameraPos = () => {
    if (currentPosition === 0) {
      setCurrentPosition(cameraPositions.length - 1);
    } else {
      let decrement = currentPosition - 1;
      setCurrentPosition(decrement);
    }
    changeCameraPosition(currentPosition);
  };
  return (
    <div
      className={
        'absolute w-1/2 h-12 flex items-center justify-between bottom-[1.5rem] right-[1.5rem]'
      }
    >
      <div className={'flex h-full'}>
        <div
          onClick={handlePrevCameraPos}
          className={
            'border-feeney_primary group border-2 cursor-pointer text-feeney_primary flex border w-12 h-full rounded-full'
          }
        >
          <ChevronLeft
            className={
              'm-auto transition-all duration-500 group-hover:-translate-x-1'
            }
          />
        </div>
        <div
          onClick={respawnCamera}
          className={
            'w-12 h-full mx-4 flex text-white cursor-pointer rounded bg-feeney_primary'
          }
        >
          <Video className={'m-auto'} />
        </div>
        <div
          onClick={handleNextCameraPos}
          className={
            'border-feeney_primary border-2 group cursor-pointer text-feeney_primary flex border w-12 h-full rounded-full'
          }
        >
          <ChevronRight
            className={
              'm-auto transition-all duration-500 group-hover:translate-x-1'
            }
          />
        </div>
      </div>
      <div
        onClick={toggleFullscreen}
        className={
          'w-12 h-full group flex text-white cursor-pointer rounded bg-feeney_primary'
        }
      >
        {inFullscreenMode ? (
          <Minimize
            className={'m-auto group-hover:w-[26px] group-hover:h-[28px]'}
          />
        ) : (
          <Maximize
            className={'m-auto group-hover:w-[26px] group-hover:h-[28px]'}
          />
        )}
      </div>
    </div>
  );
}
