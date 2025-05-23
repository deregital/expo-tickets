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
    event.startingDate,
  );

  const cardEvent = (
    <CardEvent
      title={event.name}
      dayOfWeek={dayOfWeek}
      date={day}
      month={month}
      year={year}
      time={time}
      imageUrl={event.mainPictureUrl || '/Foto.png'}
    />
  );

  return <Link href={`/${event.id}`}>{cardEvent}</Link>;
}

export default EventCardContainer;
