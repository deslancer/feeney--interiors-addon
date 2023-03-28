import { ChevronDown } from 'react-feather';
import { useContext } from 'react';
import AccordionItemContext from './AccordionItemContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AccordionHeaderProps extends React.PropsWithChildren {
  bgClass?: string;
}

export function AccordionHeader(props: AccordionHeaderProps) {
  const { children } = props;
  const { expanded, toggle } = useContext(AccordionItemContext);

  return (
    <div
      onClick={toggle}
      aria-expanded={expanded}
      className="flex group select-none border-b border-feeney_highlight justify-between p-3 transition-all duration-500 hover:text-feeney_primary cursor-pointer rounded-sm relative capitalize"
    >
      {children}
      <p className={"bg-feeney_primary ml-4 p-1"}>
        <ChevronDown
            className={`transition-transform group-hover:text-white ${expanded ? 'rotate-180' : ''}`}
        />
      </p>

    </div>
  );
}

AccordionHeader.displayName = 'AccordionHeader';

export default AccordionHeader;
