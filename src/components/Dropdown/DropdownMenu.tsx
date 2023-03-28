import React, { useContext, useMemo } from 'react';
import DropdownContext from './DropdownContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DropdownMenuProps extends React.HTMLProps<HTMLElement> {}

function DropdownMenu(props: DropdownMenuProps): JSX.Element {
  const { children } = props;

  const { variant, menuAnchor } = useContext(DropdownContext);

  // for future styling
  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'dark': {
        return '';
      }

      default: {
        return '';
      }
    }
  }, [variant]);

  const menuAnchorStyles = useMemo(() => {
    switch (menuAnchor) {
      case 'right': {
        return 'right-0';
      }
      case 'left':
      default: {
        return 'left-0';
      }
    }
  }, [menuAnchor]);

  return (
    <div
      className={`absolute hidden z-10 w-max min-w-[7rem] ${menuAnchorStyles} group-hover:block hover:block origin-top-left ${variantStyles}`}
      role="menu"
      aria-orientation="vertical"
      tabIndex={-1}
    >
      <div className="mt-2.5 bg-feeney_secondary shadow-lg ring-1 ring-white ring-opacity-75 focus:outline-none rounded-sm">
        {children}
      </div>
    </div>
  );
}

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
