import { trpc } from '@/server/trpc/server';
import { MapPin } from 'lucide-react';
import HeaderTickets from '@/components/Event/HeaderTickets';
import InformationEvent from '@/components/Event/InformationEvent';
import TicketPurchase from '@/components/Event/TicketPurchase';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function EventPage({ params }: EventPageProps) {
  const resolvedParams = await params;
  const event = await trpc.filterEvents.getEventById(resolvedParams.slug);

  if (!event) {
    return (
      <div className='max-w-7xl mx-5 md:mx-[3rem] py-8 px-4'>
        <h1 className='text-2xl font-bold text-center'>Evento no encontrado</h1>
      </div>
    );
  }

  return (
    <div className='flex justify-center px-1 sm:px-4 my-14'>
      <main className='w-full max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-5rem)] lg:max-w-6xl rounded-[20px] border-2 border-MiExpo_gray overflow-hidden'>
        {/* Versión para escritorio (md y superior) */}
        <div className='hidden md:grid md:grid-rows-5'>
          {/* Primera parte - HeaderTickets */}
          <div className='row-span-1 border-b border-MiExpo_gray overflow-hidden'>
            <HeaderTickets event={event} />
          </div>

          {/* Segunda parte - Compra de entradas */}
          <div className='row-span-4 grid grid-cols-16 border-MiExpo_gray overflow-hidden mt-6'>
            <div className='col-span-12 px-6 pb-4 overflow-hidden'>
              <TicketPurchase eventTickets={event.eventTickets} />
            </div>

            <div className='col-span-4 px-4 flex flex-col justify-start items-center overflow-hidden'>
              {/* Información del evento */}
              <InformationEvent />
            </div>
          </div>
        </div>

        {/* Versión para móvil (menos de md) */}
        <div className='flex flex-col md:hidden'>
          {/* HeaderTickets - Título y fecha */}
          <div className='border-b border-MiExpo_gray p-4'>
            <h1 className='text-2xl font-bold text-black'>{event.name}</h1>
            <p className='text-MiExpo_purple mt-1'>
              {new Date(event.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              - {new Date(event.startingDate).getHours()}:
              {new Date(event.startingDate)
                .getMinutes()
                .toString()
                .padStart(2, '0')}{' '}
              hrs.
            </p>
          </div>

          {/* Ubicación */}
          <div className='border-b border-MiExpo_gray p-4'>
            <div className='flex items-start'>
              <div className='flex items-center justify-center mr-2'>
                <MapPin
                  className='text-black'
                  height={24}
                  width={24}
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <p className='font-semibold text-black'>{event.location}</p>
                <p className='text-gray-600'>{event.location}</p>
                <p className='text-gray-600'>
                  {event.location}, {event.location}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de compra de tickets */}
          <div className='p-4'>
            <TicketPurchase eventTickets={event.eventTickets} />
          </div>

          {/* Información del evento */}
          <div className='p-4'>
            <InformationEvent />
          </div>
        </div>
      </main>
    </div>
  );
}

export default EventPage;
