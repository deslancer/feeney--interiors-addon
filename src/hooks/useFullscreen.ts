import { MutableRefObject, useCallback, useEffect, useState } from "react";
import fscreen from "fscreen";

export function useFullscreen(appElement: MutableRefObject<HTMLDivElement>){
    const [inFullscreenMode, setInFullscreenMode] = useState(false);

    const handleFullscreenChange = useCallback((e: any) => {

        if (fscreen.fullscreenElement !== null) {
            setInFullscreenMode(true);
        } else {
            setInFullscreenMode(false);
        }

    }, []);

    const handleFullscreenError = useCallback((e: any) => {
        console.log('Fullscreen Error', e);
    }, []);

    useEffect(() => {
        if (fscreen.fullscreenEnabled) {
            fscreen.addEventListener(
                'fullscreenchange',
                handleFullscreenChange,
                false,
            );
            fscreen.addEventListener('fullscreenerror', handleFullscreenError, false);
            return () => {
                fscreen.removeEventListener('fullscreenchange', handleFullscreenChange);
                fscreen.removeEventListener('fullscreenerror', handleFullscreenError);
            };
        }
    },[]);

    const toggleFullscreen = useCallback(() => {
        if (inFullscreenMode) {
            fscreen.exitFullscreen();
        } else {
            fscreen.requestFullscreen(appElement.current);
        }
    }, [inFullscreenMode]);

    return { inFullscreenMode,toggleFullscreen }
}