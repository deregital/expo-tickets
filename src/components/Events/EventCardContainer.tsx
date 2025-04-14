'use client';
import { formatEventDate } from '@/lib/utils';
import CardEvent from './CardEvent';
import Link from 'next/link';
import { type RouterOutputs } from '@/server/routers/app';

type Event = RouterOutputs['filterEvents']['getEvents']['events'][number];

interface EventCardContainerProps {
  event: Event;
}

function EventCardContainer({ event }: EventCardContainerProps) {
  const { day, month, year, time, dayOfWeek } = formatEventDate(
    event.endingDate,
  );

  const eventTicket = event.eventTickets.filter(
    (ticket) => ticket.type === 'SPECTATOR',
  )[0];

  //const { eventDisabled } = useEventTickets(event.id, eventTicket);

  const cardEvent = (
    <CardEvent
      title={event.name}
      dayOfWeek={dayOfWeek}
      date={day}
      month={month}
      year={year}
      time={time}
      imageUrl='/Foto.png'
      //disabled={eventDisabled}
    />
  );

  return <Link href={`/${event.id}`}>{cardEvent}</Link>;
}

export default EventCardContainer;
