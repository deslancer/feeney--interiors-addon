import Dropdown from "../Dropdown/Dropdown";
import { Camera, HelpCircle, Settings, Sun } from "react-feather";
import { useState } from "react";
import { useFeeneyStore } from "../../libs/store/store";

export function Toolbar() {
    const [ isChecked, setIsChecked ] = useState<boolean>(true);
    const { setCameraMode, scene } = useFeeneyStore()
    const changeCameraMode = () => {
        setIsChecked(!isChecked)
        if (scene) {
            const orthoCamera = scene.getCameraByName("arcRotateCamera");
            const fpsCamera = scene.getCameraByName("FPSCamera");

            if (isChecked) {
                setCameraMode('orthographic')
                scene.activeCamera = orthoCamera;
                fpsCamera?.detachControl();

            } else {
                setCameraMode("FPS")
                fpsCamera?.attachControl(true);
                scene.activeCamera = fpsCamera;
            }
        }
    }
    return (
        <div
            className={"absolute h-10 flex items-center rounded-md text-white top-[3.5rem] right-[1.5rem] bg-feeney_secondary_dark"}>
            <div className={"border-r border-feeney_highlight"}>
                <Dropdown variant="dark" menuAnchor="right">
                    <Dropdown.Button>My Projects</Dropdown.Button>
                    <Dropdown.Menu>
                        <Dropdown.Item action={() => alert('test')} hotkey="">
                            MenuItem 1
                        </Dropdown.Item>
                        <Dropdown.Separator></Dropdown.Separator>
                        <Dropdown.Item action={() => alert('test')} hotkey="">
                            MenuItem 2
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className={"flex items-center px-3"}>
                    <span
                        className="font-medium">2D</span>
                <label className="relative mx-3 inline-flex items-center cursor-pointer">
                    <input type="checkbox" onChange={changeCameraMode} checked={isChecked} className="sr-only peer"/>
                    <div
                        className="w-11 h-6 bg-[#EDEDED] rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-feeney_primary after:border-feeney_primary after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <span
                    className="font-medium">3D</span>
            </div>


            <ul className={"flex gap-6 px-3 border-l  border-feeney_highlight"}>
                <li className={"cursor-pointer transition-all duration-500 hover:text-feeney_primary"}>
                    <Camera/>
                </li>
                <li className={"cursor-pointer transition-all duration-500 hover:text-feeney_primary"}>
                    <Sun/>
                </li>
                <li className={"cursor-pointer transition-all duration-500 hover:text-feeney_primary"}>
                    <Settings/>
                </li>
                <li className={"cursor-pointer transition-all duration-500 hover:text-feeney_primary"}>
                    <HelpCircle/>
                </li>
            </ul>

        </div>
    )
}