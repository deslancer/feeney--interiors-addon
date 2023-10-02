// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RenderCanvas } from '../components/RenderCanvas/RenderCanvas';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Toolbar } from '../components/Toolbar/Toolbar';
import { BottomBar } from '../components/BottomBar/BottomBar';
import { useEffect, useRef, useState } from 'react';
import { getAndSetAppData } from '../libs/data/getAndSetAppData';

export function App() {
  const initialized = useRef(false);
  const appElement = useRef<HTMLDivElement>(null!);

  const [isStartModalOpen, setIsStartModalOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getAndSetAppData().then((result) => {
        if (!result.scene && !result.project) {
          setIsStartModalOpen(true);
        }
      });
    }
  }, []);

  return (
    <main ref={appElement} className={'flex h-screen w-screen overflow-hidden'}>
      <Sidebar
        isOpenModal={isStartModalOpen}
        setIsOpenModal={setIsStartModalOpen}
      />
      <Toolbar />
      <BottomBar appElement={appElement} />
      <RenderCanvas />
    </main>
  );
}

export default App;
