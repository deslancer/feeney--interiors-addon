import React, { useContext } from 'react';
import AccordionItemContext from './AccordionItemContext';

/* eslint-disable-next-line */
export interface AccordionBodyProps extends React.PropsWithChildren {}

function AccordionBody(props: AccordionBodyProps) {
  const { children } = props;
  const { expanded } = useContext(AccordionItemContext);

  return (
    <div className={`bg-iit-light-gray ${expanded ? '' : 'hidden'}`}>
      {children}
    </div>
  );
}

export default AccordionBody;
