// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import { RenderCanvas } from "../components/RenderCanvas/RenderCanvas";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Toolbar } from "../components/Toolbar/Toolbar";
import { BottomBar } from "../components/BottomBar/BottomBar";
import { useRef } from "react";


export function App() {
    const appElement = useRef<HTMLDivElement>(null!);
    return (
        <main ref={appElement} className={"flex h-screen w-screen overflow-hidden"}>
            <Sidebar/>
            <Toolbar/>
            <BottomBar appElement={appElement}/>
            <RenderCanvas/>
        </main>
    );
}

export default App;
