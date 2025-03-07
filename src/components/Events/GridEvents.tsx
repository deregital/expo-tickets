import { formatEventDate } from '@/lib/utils';
import CardEvent from './CardEvent';
import { trpc } from '@/server/trpc/server';

function GridEvents() {
  const events = await trpc.filterEvents.getEvents();
  if (!events)
    return (
      <div className='max-w-7xl mx-auto py-8 px-4'>
        <h1 className='text-2xl font-bold'>No hay eventos</h1>
      </div>
    );

  return (
    <div className='max-w-7xl mx-auto py-8 px-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center'>
        {events?.events.map((event) => {
          const { day, month, year, time } = formatEventDate(event.date);

          return (
            <CardEvent
              key={event.id}
              title={event.name}
              date={day}
              month={month}
              year={year}
              time={time}
              imageUrl='/Foto.png'
            />
          );
        })}
      </div>
    </div>
  );
}

export default GridEvents;
