import React, { useContext } from 'react';
import AccordionItemContext from './AccordionItemContext';
import { motion } from 'framer-motion';

/* eslint-disable-next-line */
export interface AccordionBodyProps extends React.PropsWithChildren {}

function AccordionBody(props: AccordionBodyProps) {
  const { children } = props;
  const { expanded } = useContext(AccordionItemContext);

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{
        height: expanded ? 'auto' : 0,
      }}
      exit={{ height: 0 }}
      transition={{ duration: 0.8 }}
      className={`overflow-hidden`}
      // className={`bg-iit-light-gray ${expanded ? '' : 'hidden'}`}
    >
      {children}
    </motion.div>
  );
}

export default AccordionBody;
