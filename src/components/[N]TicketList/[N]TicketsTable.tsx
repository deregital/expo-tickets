'use client';

import { useState } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type Row,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface TicketsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TicketsTable<TData, TValue>({
  columns,
  data,
}: TicketsTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('');

  // Custom filter function that normalizes text
  const customFilterFn = (
    row: Row<TData>,
    columnId: string,
    filterValue: string,
  ) => {
    const searchValue = filterValue
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Get the cell value and normalize it
    const cellValue = row.getValue(columnId);
    if (cellValue == null) return false;

    const normalizedCellValue = String(cellValue)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return normalizedCellValue.includes(searchValue);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: customFilterFn,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className='space-y-4'>
      {/* Filter Input */}
      <div className='flex items-center space-x-2'>
        <Input
          placeholder='Filtrar por nombre, DNI o teléfono...'
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className='max-w-sm'
        />
        {/* Results count */}
        <div className='text-sm text-gray-600'>
          {table.getFilteredRowModel().rows.length} de {data.length} resultados
        </div>
        {globalFilter && (
          <button
            onClick={() => setGlobalFilter('')}
            className='px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors'
          >
            Limpiar
          </button>
        )}
      </div>

      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  // Define fixed widths for each column
                  const columnWidths = [
                    'w-48', // Nombre - wider for full names
                    'w-32', // DNI - standard width for ID numbers
                    'w-48', // Email - wider for email addresses
                    'w-36', // Teléfono - standard width for phone numbers
                    'w-32', // Instagram - standard width for usernames
                    'w-40', // A quien ve - medium width for this field
                  ];

                  return (
                    <TableHead
                      className={`border-1 border-MiExpo_gray/20 ${columnWidths[index] || 'w-auto'}`}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className='hover:bg-MiExpo_gray/30 transition-colors'
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    // Apply the same fixed widths to table cells
                    const columnWidths = [
                      'w-48', // Nombre
                      'w-32', // DNI
                      'w-48', // Email
                      'w-36', // Teléfono
                      'w-32', // Instagram
                      'w-40', // A quien ve
                    ];

                    return (
                      <TableCell
                        key={cell.id}
                        className={`border-1 border-MiExpo_gray/20 ${columnWidths[index] || 'w-auto'}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {globalFilter
                    ? 'No se encontraron resultados para la búsqueda.'
                    : 'No hay resultados.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
