import { notFound } from 'next/navigation';
import { trpc } from '@/server/trpc/server';
import HeaderTickets from '@/components/Event/HeaderTickets';
import InformationEvent from '@/components/Event/InformationEvent';
import TicketPurchase from '@/components/Event/TicketPurchase';

interface EventPageProps {
  params: {
    slug: string;
  };
}

async function EventPage({ params }: EventPageProps) {
  const { events } = await trpc.filterEvents.getEvents();

  const event = events.find((event) => event.id === params.slug);

  if (!event) {
    notFound();
  }

  return (
    <div className='flex justify-center px-4 my-14'>
      <main className='w-full max-w-[calc(100%-5rem)] lg:max-w-6xl rounded-[20px] border-2 border-MiExpo_gray grid grid-rows-5 overflow-hidden'>
        {/* Primera parte - HeaderTickets */}
        <div className='row-span-1 border-b border-MiExpo_gray overflow-hidden'>
          <HeaderTickets event={event} />
        </div>

        {/* Segunda parte - Compra de entradas */}
        <div className='row-span-4 grid grid-cols-16 border-MiExpo_gray overflow-hidden mt-6'>
          <div className='col-span-1 md:col-span-12 px-6 pb-4 overflow-hidden'>
            <TicketPurchase />
          </div>

          <div className='col-span-1 md:col-span-4 px-4 flex flex-col justify-start items-center overflow-hidden'>
            {/* Información del evento */}
            <InformationEvent />
          </div>
        </div>
      </main>
    </div>
  );
}

export default EventPage;
