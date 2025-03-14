'use client';
import { formatEventDate } from '@/lib/utils';
import CardEvent from './CardEvent';
import { trpc } from '@/server/trpc/client';
import { useFilter } from '@/lib/useFilter';
import { useEffect, useState } from 'react';
import { type Event } from '@/types/event';
function GridEvents() {
  const search = useFilter((state) => state.search);
  const province = useFilter((state) => state.province);
  const city = useFilter((state) => state.city);
  const date = useFilter((state) => state.date);

  const { data: eventsData, isLoading } =
    trpc.filterEvents.getEvents.useQuery();

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!eventsData?.events) {
      setFilteredEvents([]);
      return;
    }

    let filtered = [...eventsData.events];

    if (search) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (province) {
      filtered = filtered.filter((event) => event.location.includes(province));
    }

    if (city) {
      filtered = filtered.filter((event) => event.location.includes(city));
    }

    if (date) {
      const today = new Date();
      console.log('Filtering by date:', date);

      if (date === 'hoy') {
        console.log('Filtering for today:', today.toDateString());
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === today.toDateString();
        });
      } else if (date === 'manana') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        console.log('Filtering for tomorrow:', tomorrow.toDateString());

        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === tomorrow.toDateString();
        });
      } else if (date === 'esta-semana') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        console.log(
          'Filtering for week:',
          startOfWeek.toDateString(),
          'to',
          endOfWeek.toDateString(),
        );

        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        });
      } else if (date === 'este-mes') {
        console.log(
          'Filtering for current month:',
          today.getMonth() + 1,
          today.getFullYear(),
        );
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear()
          );
        });
      } else if (date.includes('-')) {
        // Format YYYY-MM for specific months
        const [year, month] = date.split('-').map(Number);
        console.log('Filtering for specific month:', month, year);

        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getMonth() === month - 1 &&
            eventDate.getFullYear() === year
          );
        });
      }
    }

    console.log(`After filtering: ${filtered.length} events remaining`);
    if (filtered.length > 0) {
      console.log('Sample event:', filtered[0]);
    }

    setFilteredEvents(filtered);
  }, [eventsData, search, province, city, date]);

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
    <div className='max-w-7xl mx-5 md:mx-[3rem] py-4 sm:py-8'>
      <div className='flex flex-wrap gap-6 justify-center'>
        {filteredEvents.map((event) => {
          const { day, month, year, time, dayOfWeek } = formatEventDate(
            event.date,
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
