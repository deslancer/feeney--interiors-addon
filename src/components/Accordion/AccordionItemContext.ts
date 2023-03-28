import { createContext } from 'react';

export interface AccordionItemContextValue {
  expanded?: boolean;
  toggle?: () => void;
}

const AccordionItemContext = createContext<AccordionItemContextValue>({});
AccordionItemContext.displayName = 'AccordionItemContext';

export default AccordionItemContext;
