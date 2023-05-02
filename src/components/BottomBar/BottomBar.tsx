import { ChevronLeft, ChevronRight, Maximize, Minimize, Video } from "react-feather";
import { MutableRefObject } from "react";
import { useFullscreen } from "../../hooks/useFullscreen";
import { respawnCamera } from "../../libs/scene3d/cameras";

interface BottomBarInterface {
    appElement: MutableRefObject<HTMLDivElement>

}

export function BottomBar({ appElement }: BottomBarInterface) {

    const { inFullscreenMode, toggleFullscreen } = useFullscreen(appElement);

    return (
        <div className={"absolute w-1/2 h-12 flex items-center justify-between bottom-[1.5rem] right-[1.5rem]"}>
            <div className={"flex h-full"}>
                <div
                    className={"border-feeney_primary group border-2 cursor-pointer text-feeney_primary flex border w-12 h-full rounded-full"}>
                    <ChevronLeft className={"m-auto transition-all duration-500 group-hover:-translate-x-1"}/>
                </div>
                <div onClick={respawnCamera} className={"w-12 h-full mx-4 flex text-white cursor-pointer rounded bg-feeney_primary"}>
                    <Video className={"m-auto"}/>
                </div>
                <div
                    className={"border-feeney_primary border-2 group cursor-pointer text-feeney_primary flex border w-12 h-full rounded-full"}>
                    <ChevronRight className={"m-auto transition-all duration-500 group-hover:translate-x-1"}/>
                </div>
            </div>
            <div onClick={toggleFullscreen}
                 className={"w-12 h-full group flex text-white cursor-pointer rounded bg-feeney_primary"}>
                {inFullscreenMode ?
                    ( <Minimize className={"m-auto group-hover:w-[26px] group-hover:h-[28px]"}/> ) :
                    ( <Maximize className={"m-auto group-hover:w-[26px] group-hover:h-[28px]"}/> )}
            </div>
        </div>
    )
}