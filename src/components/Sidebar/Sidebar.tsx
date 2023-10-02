/* eslint-disable @typescript-eslint/no-explicit-any */
import Accordion from '../Accordion/Accordion';
import {useFeeneyStore} from '../../libs/store/store';
import {useEffect, useState} from 'react';
import {RailingGenerator} from '../../libs/logic/railingGenerator';
import {WelcomeModal} from '../WelcomeModal/WelcomeModal';
import {LoadingSpinner} from '../Preloader/LoadingSpinner';
import {mItem, mItemList} from './Animate';
import './Sidebar.module.scss';
import {AnimatePresence, motion} from 'framer-motion';
import {setParamsDependencies} from '../../libs/logic/paramsDependencies';
import {MessageSquare, Printer, Share2} from 'react-feather';
import {Select} from "../Select/Select";
import {railingColors} from "./railingColorsList";

interface SidebarProps {
    isOpenModal: boolean;
    setIsOpenModal: (state: boolean) => void;
}

interface ActiveItem {
    id: string;
    text: string;
    icon: string;
    children: Array<any>
}

export function Sidebar(props: SidebarProps) {
    const {isOpenModal, setIsOpenModal} = props;
    const [activeItem, setActiveItem] = useState<ActiveItem | null>(null);
    const store: any = useFeeneyStore();
    const [toggleTabState, setToggleTabState] = useState(1);
    const [showSubChildren, setShowSubChildren] = useState(false)
    const [isUniformColorChanging, setIsUniformColorChanging] = useState(false)
    const toggleTab = async (index: number) => {
        setToggleTabState(index);
    };
    useEffect(() => {
        if (store.rebuild) {
            const railingBuilder = new RailingGenerator();
            railingBuilder.buildRailing();
            store.setRebuild(false);
        }
    }, [store.rebuild]);

    const handleParamsChange = (type: string, item: any) => {
        if (item.children.length === 0) {
            const typeSanitized = 'set' + type.replaceAll(' ', '').replace('Edit', '');
            store.setRebuild(true);
            const parsedParam = JSON.parse(item.metadata);
            console.log(parsedParam)
            store[typeSanitized](parsedParam.value);
            setParamsDependencies();
        } else {
            setShowSubChildren(true)
        }

        setActiveItem(item);

    };

    const UIDL: any[] =
        store.appData && (store.appData[0].uidl[0].children as Array<any>);

    const filterItems = (children: any[]) => {
        return children.filter((child) => {
            if (child.metadata) {
                const metadata = JSON.parse(child.metadata);
                if (
                    metadata.compatibility &&
                    metadata.compatibility.includes(store.railingType[0]) ||
                    metadata.compatibility === 'any'
                ) {
                    return true;
                }
            }
        });
    };
    const getQuote = () => {
        const userId = store.user ? store.user.id : '';
        const token = store.accessToken ? store.accessToken : '';
        const addonId = store.project ? store.project.id : '';
        window.location.replace(
            `https://feeney.interiordesigntools.com/?userId=${userId}&token=${token}&addonId=${addonId}`
        );
    };

    return (
        <div
            className={
                'w-80 h-full fixed flex flex-col bg-feeney_secondary text-white'
            }
        >
            <div>
                <div
                    className={
                        'flex  h-36 border-b bg-feeney_secondary_dark  border-feeney_highlight'
                    }
                >
                    {UIDL &&
                        UIDL.map((elem, index) => (
                            <div
                                onClick={() => toggleTab(index + 1)}
                                key={index}
                                className={`flex ${
                                    toggleTabState === index + 1 ? 'bg-feeney_secondary' : ''
                                }
                          cursor-pointer transition-all duration-500 hover:text-feeney_primary px-5 w-1/2 `}
                            >
                                <div className={'m-auto'}>
                                    <p className={'my-2'}>Step {index + 1}</p>
                                    <h3 className={'text-xl font-bold'}>{elem.text}</h3>
                                </div>
                            </div>
                        ))}
                </div>
                {UIDL &&
                    UIDL.map((elem, index) => (
                        <div
                            key={index}
                            className={`${
                                toggleTabState === index + 1 ? 'flex' : 'hidden'
                            } w-full overflow-y-auto h-[70vh] max-h-screen`}
                        >
                            <Accordion className={'w-full'}>
                                {elem.children.map((item: any, itemIndex: number) => (
                                    <Accordion.Item key={elem.id + itemIndex} expanded={false}>
                                        <Accordion.Header>
                                            <p className={'text-base'}>{item.text}</p>
                                        </Accordion.Header>

                                        <Accordion.Body>
                                            <AnimatePresence>
                                                <motion.ul
                                                    className={
                                                        'grid overflow-hidden m-0 grid-cols-3 grid-rows-1 gap-4 p-4 '
                                                    }
                                                    variants={mItemList}
                                                    initial="hidden"
                                                    animate="visible"
                                                >
                                                    {filterItems(item.children).map(
                                                        (subItem: any, subItemIndex: number) => (
                                                            <motion.li
                                                                key={subItemIndex}
                                                                variants={mItem}
                                                                className={
                                                                    'flex flex-col w-16 cursor-pointer items-center text-center'
                                                                }
                                                                onClick={() =>
                                                                    handleParamsChange(
                                                                        item.text,
                                                                        subItem
                                                                    )
                                                                }
                                                            >
                                                                <div
                                                                    className={`w-16 h-16 flex p-1 ${
                                                                        activeItem && activeItem.id === subItem.id &&
                                                                        subItem.parentId === item.id &&
                                                                        'border-4  border-solid border-feeney_primary rounded-full'
                                                                    }`}
                                                                >
                                                                    <motion.img
                                                                        className={`w-14 m-auto`}
                                                                        whileHover={{
                                                                            scale: 1.08,
                                                                        }}
                                                                        whileTap={{
                                                                            scale: 0.95,
                                                                        }}
                                                                        transition={{
                                                                            duration: 0.1,
                                                                        }}
                                                                        src={
                                                                            subItem.icon
                                                                                ? subItem.icon
                                                                                : 'https://placehold.co/100x100?text=No+Image'
                                                                        }
                                                                        alt={subItem.name}
                                                                    />
                                                                </div>

                                                                <p
                                                                    className={`mt-2 text-xs`}
                                                                >
                                                                    {subItem.text}
                                                                </p>
                                                            </motion.li>
                                                        )
                                                    )}
                                                </motion.ul>
                                                {showSubChildren && activeItem && (
                                                    <div
                                                        key={elem.id + itemIndex * 10}
                                                        className={"px-4 py-8 bg-feeney_secondary_dark "}>
                                                        <p className={"mb-4"}>Select design</p>
                                                        <div className={"flex flex-wrap justify-around gap-4"}>

                                                            {activeItem.children.map((child, ch_index) => (
                                                                <div
                                                                    key={child.id + ch_index}
                                                                    className={
                                                                        'flex flex-col w-16 cursor-pointer items-center text-center'
                                                                    }
                                                                    onClick={() =>
                                                                        handleParamsChange(
                                                                            item.text,
                                                                            child
                                                                        )
                                                                    }
                                                                >
                                                                    <div
                                                                        className={`w-16 h-16 flex p-1 ${
                                                                            activeItem.id === child.id &&
                                                                            child.parentId === item.id &&
                                                                            'border-4  border-solid border-feeney_primary rounded-full'
                                                                        }`}
                                                                    >
                                                                        <motion.img
                                                                            className={`w-14 m-auto`}
                                                                            whileHover={{
                                                                                scale: 1.08,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.95,
                                                                            }}
                                                                            transition={{
                                                                                duration: 0.1,
                                                                            }}
                                                                            src={
                                                                                child.icon
                                                                                    ? child.icon
                                                                                    : 'https://placehold.co/100x100?text=No+Image'
                                                                            }
                                                                            alt={child.text}
                                                                        />
                                                                    </div>

                                                                    <p
                                                                        className={`mt-2 text-xs`}
                                                                    >
                                                                        {child.text}
                                                                    </p>
                                                                </div>
                                                            ))}

                                                        </div>
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                                {toggleTabState === 2 && (
                                    <Accordion.Item expanded={false}>
                                        <Accordion.Header>
                                            <p className={'text-base'}>Edit Railing Color</p>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <motion.ul
                                                className={
                                                    'flex overflow-hidden m-0 flex-col gap-4 p-4 '
                                                }
                                                variants={mItemList}
                                                initial="hidden"
                                                animate="visible"
                                            >
                                                <motion.li
                                                    variants={mItem}
                                                    className={
                                                        'flex flex-col w-full cursor-pointer text-center'
                                                    }
                                                >
                                                    <div className={'flex justify-between items-center'}>
                                                        <span className="font-medium">Uniform Railing Color</span>
                                                        <label
                                                            className="relative mx-3 inline-flex items-center cursor-pointer">
                                                            <input
                                                                onChange={() => setIsUniformColorChanging(!isUniformColorChanging)}
                                                                type="checkbox"
                                                                checked={isUniformColorChanging}
                                                                className="sr-only peer"
                                                            />
                                                            <div
                                                                className="w-11 h-6 bg-[#EDEDED] rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-feeney_primary after:border-feeney_primary after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                                        </label>
                                                    </div>
                                                    <Select withLabel={false} options={railingColors}/>
                                                    <Select withLabel={true} disabled={true} labelText={"Top Rail"}
                                                            options={railingColors}/>
                                                    <Select withLabel={true} disabled={true} labelText={"Post"}
                                                            options={railingColors}/>
                                                    <Select withLabel={true} disabled={true} labelText={"Bottom Rail"}
                                                            options={railingColors}/>
                                                    <Select withLabel={true} disabled={true} labelText={"Picket"}
                                                            options={railingColors}/>
                                                </motion.li>
                                            </motion.ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )}
                            </Accordion>
                        </div>
                    ))}
            </div>
            <div className={'absolute bottom-0 w-full'}>
                <div className={'flex justify-around mb-2'}>
                    <div>
                        <button className={'flex flex-col items-center'}>
                            <Share2/>
                            <p className={'text-sm'}>Share</p>
                        </button>
                    </div>
                    <div>
                        <button className={'flex flex-col items-center'}>
                            <Printer/>
                            <p className={'text-sm'}>Print</p>
                        </button>
                    </div>
                    <div onClick={getQuote}>
                        <button className={'flex flex-col items-center'}>
                            <MessageSquare/>
                            <p className={'text-sm'}>
                                Get A <br/> Quote
                            </p>
                        </button>
                    </div>
                </div>
                <div
                    onClick={() => setIsOpenModal(true)}
                    className={
                        'bg-feeney_primary cursor-pointer text-center py-4 text-white font-bold  w-full'
                    }
                >
                    Change Interior
                </div>
            </div>

            <WelcomeModal
                key={'welcomeModal'}
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
            />

            {store.isRailingBuilding && <LoadingSpinner/>}
        </div>
    );
}
