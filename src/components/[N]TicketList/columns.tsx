'use client';

import { type RouterOutputs } from '@/server/routers/app';
import { type ColumnDef } from '@tanstack/react-table';

type Ticket =
  RouterOutputs['expoTicketsProducerLogin']['getEventTickets']['event']['tickets'][number];

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: 'fullName',
    header: 'Nombre',
  },
  {
    accessorKey: 'dni',
    header: 'DNI',
  },
  {
    accessorKey: 'mail',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Teléfono',
  },
  {
    accessorKey: 'instagram',
    header: 'Instagram',
    accessorFn: (row) => row.instagrams[0],
  },
  {
    accessorKey: 'whoToWatch',
    header: 'A quien ve',
  },
];
