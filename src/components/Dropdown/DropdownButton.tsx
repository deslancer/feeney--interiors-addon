import { useContext, useMemo } from 'react';
import DropdownContext from './DropdownContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DropdownButtonProps extends React.HTMLProps<HTMLElement> {}

function DropdownButton(props: DropdownButtonProps) {
  const { children } = props;

  const { variant } = useContext(DropdownContext);

  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'dark': {
        return 'bg-feeney_secondary_dark';
      }
      case 'gray': {
        return 'bg-feeney_secondary';
      }

      default: {
        return 'bg-feeney_secondary';
      }
    }
  }, [variant]);

  return (
    <button
      className={`inline-flex w-full justify-center rounded-sm px-3 py-1 text-base font-medium text-white shadow-sm  focus:outline-none ${variantStyles} `}
      aria-expanded="true"
      aria-haspopup="true"
    >
      {children}
      <svg
        className="-mr-1 ml-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

DropdownButton.displayName = 'DropdownButton';

export default DropdownButton;
