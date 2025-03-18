'use client';
import { formatEventDate } from '@/lib/utils';
import CardEvent from './CardEvent';
import { trpc } from '@/server/trpc/client';
import { useParamsFilter } from '@/lib/useFilter';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';

function GridEvents() {
  const { search, province, city, date } = useParamsFilter();

  const { data: eventsData, isLoading } =
    trpc.filterEvents.getEvents.useQuery();

  const filteredEvents = useFilteredEvents(eventsData, {
    search: search || '',
    province: province || '',
    city: city || '',
    date: date || '',
  });

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto py-8 px-4'>
        <h1 className='text-2xl font-bold'>Cargando eventos...</h1>
      </div>
    );
  }

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <div className='max-w-7xl mx-5 md:mx-[3rem] py-8 px-4'>
        <h1 className='text-2xl font-bold text-center'>No hay eventos</h1>
      </div>
    );
  }

  return (
    <div className='max-w-full mx-5 md:mx-[3rem] py-4 sm:py-8'>
      <div className='flex flex-wrap gap-6 items-center'>
        {filteredEvents.map((event) => {
          const { day, month, year, time, dayOfWeek } = formatEventDate(
            event.startingDate,
          );

          return (
            <CardEvent
              key={event.id}
              id={event.id}
              title={event.name}
              dayOfWeek={dayOfWeek}
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
