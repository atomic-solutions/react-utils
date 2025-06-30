'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { FileQuestion } from 'lucide-react';
import Pagination from './Pagination';

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  defaultFilters?: ColumnFiltersState;
  loading?: boolean;
  createAction?: React.ComponentType<{ action: string }>;
  title?: string;
  className?: string;
  tableClassName?: string;
  cardClassName?: string;
  emptyStateMessage?: string;
  showPagination?: boolean;
  renderFilters?: (
    setColumnsFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  ) => React.ReactNode;
  LoadingComponent?: React.ComponentType;
}

interface TableProps {
  className?: string;
  children: React.ReactNode;
}

interface TableHeaderProps {
  children: React.ReactNode;
}

interface TableBodyProps {
  children: React.ReactNode;
}

interface TableRowProps {
  children: React.ReactNode;
}

interface TableHeadProps {
  className?: string;
  children: React.ReactNode;
}

interface TableCellProps {
  className?: string;
  children: React.ReactNode;
  colSpan?: number;
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ className = '', children }) => (
  <table className={`w-full ${className}`}>{children}</table>
);

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => (
  <thead>{children}</thead>
);

const TableBody: React.FC<TableBodyProps> = ({ children }) => (
  <tbody>{children}</tbody>
);

const TableRow: React.FC<TableRowProps> = ({ children }) => <tr>{children}</tr>;

const TableHead: React.FC<TableHeadProps> = ({ className = '', children }) => (
  <th className={`p-3 text-left font-medium ${className}`}>{children}</th>
);

const TableCell: React.FC<TableCellProps> = ({
  className = '',
  children,
  colSpan,
}) => (
  <td className={`p-3 ${className}`} colSpan={colSpan}>
    {children}
  </td>
);

const Card: React.FC<CardProps> = ({ className = '', children }) => (
  <div className={`border rounded-lg bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const DefaultLoading: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

function DataTable<TData, TValue>({
  data,
  columns,
  defaultFilters,
  loading = false,
  createAction: CreateAction,
  title,
  className = '',
  tableClassName = '',
  cardClassName = '',
  emptyStateMessage = 'No results',
  showPagination = true,
  renderFilters,
  LoadingComponent = DefaultLoading,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnsFilters] = useState<ColumnFiltersState>(
    defaultFilters ? defaultFilters : []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: (filters) => setColumnsFilters(filters),
    state: {
      columnFilters,
    },
  });

  return (
    <div className={className}>
      {/* Title and Create Action */}
      {(title || CreateAction) && (
        <div className="w-full py-2 flex justify-between items-center">
          {title && <h1 className="text-2xl font-semibold">{title}</h1>}
          {CreateAction && (
            <div className="flex justify-end">
              <CreateAction action="create" />
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <LoadingComponent />
      ) : (
        <Card className={`rounded-md shadow-none w-full ${cardClassName}`}>
          {/* Custom Filters */}
          {renderFilters && renderFilters(setColumnsFilters)}

          <Table className={`border-b ${tableClassName}`}>
            {/* Table headers, names of columns */}
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="border-r border-t text-gray-700"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableHeader>
            {/* Rows of the table */}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id} className="border-r">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                // Empty Table
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <FileQuestion size={45} />
                      <h1 className="mt-2">{emptyStateMessage}</h1>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {showPagination && (
            <Pagination
              isFiltered={table.getState().columnFilters.length > 0}
              filteredRows={table.getFilteredRowModel().rows.length}
              totalRows={table.options.data.length}
              pageSize={table.getState().pagination.pageSize}
              resetPage={table.resetPageIndex}
              currentPage={table.getState().pagination.pageIndex}
              pageCount={table.getPageCount()}
              updatePageSize={table.setPageSize}
              prevPage={table.previousPage}
              nextPage={table.nextPage}
              isNextDisabled={!table.getCanNextPage()}
              isPrevDisabled={!table.getCanPreviousPage()}
            />
          )}
        </Card>
      )}
    </div>
  );
}

export default DataTable;
