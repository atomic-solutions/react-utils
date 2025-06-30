import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export interface PaginationProps {
  isFiltered: boolean;
  filteredRows: number;
  pageSize: number;
  updatePageSize: (size: number) => void;
  currentPage: number;
  prevPage: () => void;
  nextPage: () => void;
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
  resetPage: () => void;
  totalRows: number;
  pageCount: number;
  className?: string;
  pageSizeOptions?: number[];
}

interface ButtonProps {
  variant?: 'ghost' | 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface DropdownMenuContentProps {
  className?: string;
  children: React.ReactNode;
}

interface DropdownMenuItemProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
  children,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantStyles = {
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(
              child as React.ReactElement<DropdownMenuTriggerProps>,
              {
                onClick: () => setIsOpen(!isOpen),
              }
            );
          }
          if (child.type === DropdownMenuContent) {
            return isOpen
              ? React.cloneElement(
                  child as React.ReactElement<
                    DropdownMenuContentProps & { onClose?: () => void }
                  >,
                  {
                    onClose: () => setIsOpen(false),
                  }
                )
              : null;
          }
        }
        return child;
      })}
    </div>
  );
};

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  className = '',
  children,
  ...props
}) => (
  <button
    className={`bg-white rounded p-1 flex items-center justify-around border border-gray-300 text-sm outline-none w-12 hover:bg-gray-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const DropdownMenuContent: React.FC<
  DropdownMenuContentProps & { onClose?: () => void }
> = ({ className = '', children, onClose }) => (
  <>
    <div className="fixed inset-0 z-10" onClick={onClose} />
    <div
      className={`absolute z-20 mt-1 bg-white max-w-xs flex flex-col gap-1 rounded border border-gray-200 shadow-lg ${className}`}
    >
      {children}
    </div>
  </>
);

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  className = '',
  onClick,
  children,
}) => (
  <button
    className={`border-b hover:cursor-pointer outline-none hover:bg-gray-100 hover:text-gray-900 p-2 text-sm rounded text-left w-full ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

function Pagination({
  isFiltered,
  filteredRows,
  pageSize,
  updatePageSize,
  currentPage,
  prevPage,
  nextPage,
  isNextDisabled,
  isPrevDisabled,
  resetPage,
  totalRows,
  className = '',
  pageSizeOptions = [10, 20, 30, 50, 100],
}: PaginationProps) {
  const calculatePagination = () => {
    if (isFiltered) {
      if (currentPage === 0) {
        if (pageSize > filteredRows) {
          return `${currentPage + 1}-${filteredRows}`;
        }
        return `${currentPage + 1}-${pageSize}`;
      }

      if ((currentPage + 1) * pageSize > filteredRows) {
        return `${currentPage * pageSize + 1}-${filteredRows}`;
      }

      return `${currentPage * pageSize + 1}-${(currentPage + 1) * pageSize}`;
    }

    if (currentPage === 0) {
      if (pageSize > totalRows) {
        return `${currentPage + 1}-${totalRows}`;
      }
      return `${currentPage + 1}-${pageSize}`;
    }

    if ((currentPage + 1) * pageSize > totalRows) {
      return `${currentPage * pageSize + 1}-${totalRows}`;
    }

    return `${currentPage * pageSize + 1}-${(currentPage + 1) * pageSize}`;
  };

  return (
    <div
      className={`flex items-center justify-between space-x-2 py-4 h-12 ${className}`}
    >
      {/* Rows per page part */}
      <div className="flex items-center gap-3 px-4">
        <h4 className="text-sm text-gray-700">Rows per page:</h4>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {pageSize}
            <ArrowDown size={12} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {pageSizeOptions.map((num) => (
              <DropdownMenuItem
                onClick={() => {
                  updatePageSize(num);
                  resetPage();
                }}
                key={num}
              >
                {num}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Current page, page total with next/prev page buttons */}
      <div className="flex gap-2 items-center px-4">
        <span className="text-sm text-gray-700 flex gap-1">
          {calculatePagination()}{' '}
          <span className="text-gray-500">
            of {isFiltered ? filteredRows : totalRows}
          </span>
        </span>
        <div className="flex">
          <Button
            variant="ghost"
            onClick={() => prevPage()}
            className="p-2 h-8 w-8 cursor-pointer rounded-tr-none rounded-br-none border border-gray-300 hover:bg-gray-100"
            disabled={isPrevDisabled}
          >
            <ArrowLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => nextPage()}
            disabled={isNextDisabled}
            className="p-2 h-8 w-8 cursor-pointer rounded-tl-none rounded-bl-none border border-gray-300 hover:bg-gray-100"
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
