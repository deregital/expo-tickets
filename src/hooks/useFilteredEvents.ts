'use client';
import { type RouterOutputs } from '@/server/routers/app';

type Events = RouterOutputs['filterEvents']['getEvents']['events'];
type Event = Events[number];
type EventsData = RouterOutputs['filterEvents']['getEvents'] | undefined;

export function useFilteredEvents(
  eventsData: EventsData,
  {
    search,
    province,
    city,
    date,
  }: {
    search: string;
    province: string;
    city: string;
    date: string;
  },
): Events {
  if (!eventsData?.events) return [];

  const filters = {
    search: (event: Event) =>
      search ? event.name.toLowerCase().includes(search.toLowerCase()) : true,
    province: (event: Event) =>
      province ? event.location.includes(province) : true, // TODO: Fix this when we have provinces and googleMaps
    city: (event: Event) => (city ? event.location.includes(city) : true), // TODO: Fix this when we have provinces and googleMaps
    date: (event: Event) =>
      date ? filterByDate(event.endingDate, date) : true,
  };

  return eventsData.events.filter((event) =>
    Object.values(filters).every((fn) => fn(event)),
  );
}

function filterByDate(eventDateStr: string, date: string): boolean {
  const today = new Date();
  const eventDate = new Date(eventDateStr);

  const dateFilters: Record<string, () => boolean> = {
    hoy: () => eventDate.toDateString() === today.toDateString(),
    manana: () => {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return eventDate.toDateString() === tomorrow.toDateString();
    },
    'esta-semana': () => {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    },
    'este-mes': () =>
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear(),
  };

  if (date in dateFilters) return dateFilters[date]();

  if (date.includes('-')) {
    const [year, month] = date.split('-').map(Number);
    return (
      eventDate.getMonth() === month - 1 && eventDate.getFullYear() === year
    );
  }

  return true;
}
