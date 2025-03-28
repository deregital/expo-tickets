'use client';
import { type RouterOutputs } from '@/server/routers/app';
import { trpc } from '@/server/trpc/client';
import { useState, useEffect } from 'react';

export function useEventTickets(
  eventId: string,
  eventTickets: RouterOutputs['filterEvents']['getEvents']['events'][number]['eventTickets'],
) {
  const [eventDisabled, setEventDisabled] = useState(false);

  const { data: ticketsEmited } =
    trpc.ticketGroup.getTicketsByEvent.useQuery(eventId);

  useEffect(() => {
    const maxTickets = eventTickets.find(
      (ticket) => ticket.type === 'SPECTATOR',
    )?.amount;

    if (!maxTickets) {
      setEventDisabled(true);
      return;
    }

    if (ticketsEmited?.tickets && ticketsEmited.tickets >= maxTickets) {
      setEventDisabled(true);
    } else if (!ticketsEmited?.tickets) {
      setEventDisabled(true);
    } else {
      setEventDisabled(false);
    }
  }, [eventTickets, ticketsEmited]);

  return { eventDisabled };
}
