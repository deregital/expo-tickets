'use client';
import { type RouterOutputs } from '@/server/routers/app';

type Events = RouterOutputs['filterEvents']['getEvents']['events'];
type EventsData = RouterOutputs['filterEvents']['getEvents'] | undefined;

export function useFilteredEvents() {
  // Devuelve una función que realiza el filtrado
  return (
    eventsData: EventsData,
    search: string,
    province: string,
    city: string,
    date: string,
  ): Events => {
    if (!eventsData?.events) {
      return [];
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

    return filtered;
  };
}
