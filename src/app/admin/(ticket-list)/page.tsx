import { TicketsTable } from '@/components/[N]TicketList/[N]TicketsTable';
import { columns } from '@/components/[N]TicketList/columns';
import { trpc } from '@/server/trpc/server';
import { formatInTimeZone } from 'date-fns-tz';
import { CalendarIcon, ClockIcon, MapPin } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function TicketListPage() {
  const cookieStore = await cookies();
  const mail = cookieStore.get('mail');
  const password = cookieStore.get('password');

  if (!mail || !password) {
    redirect('/admin/login');
  }

  const { event } = await trpc.expoTicketsProducerLogin.getEventTickets({
    mail: mail.value,
    password: password.value,
  });

  return (
    <>
      <div className='col-span-3 p-2 pt-5'>
        <h3 className='text-center text-2xl font-bold'>{event?.name}</h3>
      </div>
      <div className='flex flex-wrap items-center justify-center gap-x-3 pb-3'>
        <h3 className='flex items-center gap-x-1 p-2 text-center align-middle text-sm sm:text-base'>
          <CalendarIcon className='inline h-5 w-5' />
          {formatInTimeZone(
            event!.startingDate,
            'America/Argentina/Buenos_Aires',
            'dd/MM/yyyy',
          )}
        </h3>
        <h3 className='flex items-center gap-x-1 p-2 text-center align-middle text-sm sm:text-base'>
          <ClockIcon className='inline h-5 w-5' />
          {formatInTimeZone(
            event!.startingDate,
            'America/Argentina/Buenos_Aires',
            'HH:mm',
          )}{' '}
          -{' '}
          {formatInTimeZone(
            event!.endingDate,
            'America/Argentina/Buenos_Aires',
            'HH:mm',
          )}
        </h3>
        <h3 className='flex items-center p-2 text-center text-sm sm:text-base'>
          <MapPin className='inline h-5 w-5' />
          {event?.location}
        </h3>
      </div>
      <div className='p-2'>
        <TicketsTable columns={columns} data={event?.tickets} />
      </div>
    </>
  );
}
