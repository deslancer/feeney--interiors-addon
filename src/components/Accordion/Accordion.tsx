import AccordionBody from './AccordionBody';
import AccordionHeader from './AccordionHeader';
import AccordionItem from './AccordionItem';

/* eslint-disable-next-line */
export interface AccordionProps
  extends React.PropsWithChildren,
    Pick<React.HTMLProps<HTMLElement>, 'className'> {}
/**
 * Vertically collapsed accordions
 *
 * Accordion.Item could be used without Accordion wrapper
 *
 * @prop {Boolean} expanded - Accordion.Item optional parameter; default=false
 *
 * @example
 * <Accordion>
 *   <Accordion.Item expanded={true}>
 *     <Accordion.Header>Header</Accordion.Header>
 *     <Accordion.Body>
 *       Content
 *     </Accordion.Body>
 *   </Accordion.Item>
 * </Accordion>
 */
export function Accordion(props: AccordionProps) {
  const { children, className } = props;

  return <div className={className}>{children}</div>;
}
const defaultProps: AccordionProps = {};

Accordion.defaultProps = defaultProps;
Accordion.displayName = 'Accordion';

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;

export default Accordion;
