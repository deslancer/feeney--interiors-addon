import React, { useMemo } from 'react';
import DropdownContext, {
  DropdownMenuAnchor,
  DropdownVariant,
} from './DropdownContext';
import DropdownButton from './DropdownButton';
import DropdownMenu from './DropdownMenu';
import DropdownItem from './DropdownItem';
import DropdownSeparator from './DropdownSeparator';

// Based on
// https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Dropdown.tsx

export interface DropdownProps extends React.HTMLProps<HTMLElement> {
  variant: DropdownVariant;
  menuAnchor: DropdownMenuAnchor;
}

/**
 * Includes such elements:
 * - Button
 * - Menu (block that appears on the button hover)
 * - Item
 * - Separator (horizontal separator)
 *
 * @example
 * <Dropdown variant="dark" menuAnchor="right">
 *   <Dropdown.Button>Dropdown</Dropdown.Button>
 *     <Dropdown.Menu>
 *       <Dropdown.Item action={() => alert('test')} hotkey="Ctrl + Z">
 *          MenuItem 1
 *       </Dropdown.Item>
 *
 *       <Dropdown.Separator></Dropdown.Separator>
 *
 *       <Dropdown.Item action={() => alert('test')} hotkey="F">
 *         MenuItem 2
 *     </Dropdown.Item>
 *   </Dropdown.Menu>
 * </Dropdown>
 *
 */

export function Dropdown(props: DropdownProps): JSX.Element {
  const { variant, menuAnchor } = props;

  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'dark': {
        return 'text-white';
      }

      default: {
        return 'text-white';
      }
    }
  }, [variant]);

  const contextValue = useMemo(
    () => ({
      variant,
      menuAnchor,
    }),
    [variant, menuAnchor],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div
        className={`group relative inline-block text-left mx-2 ${variantStyles}`}
      >
        {props.children}
      </div>
    </DropdownContext.Provider>
  );
}

const defaultProps: DropdownProps = {
  variant: 'dark',
  menuAnchor: 'left',
};

Dropdown.defaultProps = defaultProps;
Dropdown.displayName = 'Dropdown';

Dropdown.Button = DropdownButton;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;
Dropdown.Separator = DropdownSeparator;

export default Dropdown;
