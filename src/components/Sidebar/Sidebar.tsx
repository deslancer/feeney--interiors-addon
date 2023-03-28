import Accordion from "../Accordion/Accordion";
import { useFeeneyStore } from "../../libs/store/store";
import { useState } from "react";

export function Sidebar() {
    const { project } = useFeeneyStore((project)=>(project));
    const [toggleTabState, setToggleTabState] = useState(1);
    const toggleTab = (index: number) => {
        setToggleTabState(index);
    };
    const UIDL = project && project[0].uidl[0].children as Array<any>;

    return (
        <div className={"w-80 h-full fixed bg-feeney_secondary text-white"}>
            <div className={"flex  h-36 border-b bg-feeney_secondary_dark  border-feeney_highlight"}>
                {UIDL && UIDL.map((elem, index)=>(
                    <div
                        onClick={() => toggleTab(index + 1)}
                        key={index}
                         className={`flex ${toggleTabState === index +1 ? 'bg-feeney_secondary' : ''}
                          cursor-pointer transition-all duration-500 hover:text-feeney_primary px-5 w-1/2 `}
                    >
                        <div className={"m-auto"}>
                            <p className={"my-2"}>Step {index + 1}</p>
                            <h3 className={"text-xl font-bold"}>{elem.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
            {UIDL && UIDL.map((elem, index)=>(
                <div key={index}  className={`${toggleTabState === index + 1 ? 'flex' : 'hidden'} w-full`}>
                    <Accordion className={"w-full"}>
                        {elem.children.map((item: any, index: number)=>(
                            <Accordion.Item key={index} expanded={false}>
                                <Accordion.Header>
                                    <p className={"text-base"}>{item.name}</p>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div  className={"p-6 flex gap-4"}>
                                        {item.children.map((subItem: any, index: number)=>(
                                            <div className={"flex flex-col items-center"}>
                                                <img className={"w-16 rounded-full"} src={subItem.icon ? subItem.icon : "https://placehold.co/100x100?text=No+Image"} alt={subItem.name}/>
                                                <div className={"mt-2"}>{subItem.name}</div>
                                            </div>

                                        ))}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}

                    </Accordion>
                </div>
            ))}
        </div>
    )
}