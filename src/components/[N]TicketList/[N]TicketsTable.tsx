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
import * as XLSX from 'xlsx';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

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

  // Function to download filtered data as Excel
  const downloadExcel = () => {
    const filteredData = table.getFilteredRowModel().rows.map((row) => {
      const rowData: Record<string, string | number | null> = {};
      columns.forEach((column) => {
        if (
          'accessorKey' in column &&
          column.accessorKey &&
          typeof column.accessorKey === 'string'
        ) {
          const value = row.getValue(column.accessorKey);
          // Get the header text for this column
          let headerText = column.accessorKey; // Default to accessorKey

          if (column.header && typeof column.header === 'string') {
            headerText = column.header;
          }

          // Handle special cases like instagrams array
          if (column.accessorKey === 'instagram' && Array.isArray(value)) {
            rowData[headerText] = value[0] || '';
          } else {
            rowData[headerText] = value as string | number | null;
          }
        }
      });
      return rowData;
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tickets');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `tickets_${date}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
  };

  // Function to print filtered data
  const printTable = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const filteredData = table.getFilteredRowModel().rows.map((row) => {
      const rowData: Record<string, string | number | null> = {};
      columns.forEach((column) => {
        if (
          'accessorKey' in column &&
          column.accessorKey &&
          typeof column.accessorKey === 'string'
        ) {
          const value = row.getValue(column.accessorKey);
          // Get the header text for this column
          let headerText = column.accessorKey; // Default to accessorKey

          if (column.header && typeof column.header === 'string') {
            headerText = column.header;
          }

          // Handle special cases like instagrams array
          if (column.accessorKey === 'instagram' && Array.isArray(value)) {
            rowData[headerText] = value[0] || '';
          } else {
            rowData[headerText] = value as string | number | null;
          }
        }
      });
      return rowData;
    });

    // Get headers
    const headers = columns
      .map((col) => {
        if (
          'accessorKey' in col &&
          col.accessorKey &&
          typeof col.accessorKey === 'string'
        ) {
          if (col.header && typeof col.header === 'string') {
            return col.header;
          }
          return col.accessorKey;
        }
        return null;
      })
      .filter((header): header is string => header !== null);

    // Create print HTML
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tickets - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .summary { margin-bottom: 20px; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Lista de Tickets</h1>
            <p>Fecha: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="summary">
            <p>Total de resultados: ${filteredData.length}</p>
            ${globalFilter ? `<p>Filtro aplicado: "${globalFilter}"</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map((header) => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (row) =>
                    `<tr>${headers.map((header) => `<td>${row[header] || ''}</td>`).join('')}</tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <div className='space-y-4'>
      {/* Filter and Actions */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Input
            placeholder='Filtrar por nombre, DNI o teléfono...'
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className='max-w-sm'
          />
          {/* Results count */}
          <div className='text-sm text-gray-600'>
            {table.getFilteredRowModel().rows.length} de {data.length}{' '}
            resultados
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

        {/* Download and Print Buttons */}
        <div className='flex items-center space-x-2'>
          <Button
            onClick={downloadExcel}
            variant='outline'
            size='sm'
            className='flex items-center space-x-2'
            disabled={table.getFilteredRowModel().rows.length === 0}
          >
            <Download className='h-4 w-4' />
            <span>Descargar Excel</span>
          </Button>

          <Button
            onClick={printTable}
            variant='outline'
            size='sm'
            className='flex items-center space-x-2'
            disabled={table.getFilteredRowModel().rows.length === 0}
          >
            <Printer className='h-4 w-4' />
            <span>Imprimir</span>
          </Button>
        </div>
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
