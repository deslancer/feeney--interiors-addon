import * as React from 'react';

export type DropdownVariant = 'dark' | 'gray';
export type DropdownMenuAnchor = 'left' | 'right';

export type DropdownContextValue = {
  variant?: DropdownVariant;
  menuAnchor?: DropdownMenuAnchor;
};

const DropdownContext = React.createContext<DropdownContextValue>({});
DropdownContext.displayName = 'DropdownContext';

export default DropdownContext;
