import { useEffect, useMemo, useState } from 'react';
import AccordionItemContext, {
  AccordionItemContextValue,
} from './AccordionItemContext';

export interface AccordionItemProps extends React.PropsWithChildren {
  /** Whether the AccordionItem is expanded. */
  expanded?: boolean;
}

/**
 * Vertically collapsed accordion item
 *
 * @example
 * <Accordion.Item expanded={false}>
 *   <Accordion.Header>Header</Accordion.Header>
 *   <Accordion.Body>
 *     Content
 *   </Accordion.Body>
 * </Accordion.Item>
 */
export function AccordionItem(props: AccordionItemProps) {
  const { expanded: opened = false, children } = props;
  const [expanded, setExpanded] = useState<boolean>(opened);

  useEffect(() => {
    setExpanded(opened);
  }, [opened]);

  const contextValue = useMemo<AccordionItemContextValue>(() => {
    const toggle = () => setExpanded(!expanded);

    return {
      expanded,
      toggle,
    };
  }, [expanded]);

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div className={`my-2 text-white min-w-[10rem]`}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

AccordionItem.displayName = 'AccordionItem';
AccordionItem.defaultProps = {
  expanded: false,
};

export default AccordionItem;
