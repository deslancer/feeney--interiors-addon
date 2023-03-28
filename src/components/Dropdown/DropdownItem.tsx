import React, { useContext, useMemo } from 'react';
import DropdownContext from './DropdownContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DropdownItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.MouseEventHandler<HTMLDivElement>;
  hotkey?: string;
}

function DropdownItem(props: DropdownItemProps) {
  const { action, children, hotkey } = props;
  const { variant } = useContext(DropdownContext);

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

  return (
    <div
      className={`hover:bg-feeney_secondary_dark flex justify-between items-center px-4 py-2 text-sm cursor-pointer ${variantStyles}`}
      role="menuitem"
      tabIndex={-1}
      onClick={action}
    >
      <div>{children}</div>
      {hotkey && <div className="opacity-60 text-xs ml-3">{hotkey}</div>}
    </div>
  );
}

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
