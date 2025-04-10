'use client';
import { type RouterOutputs } from '@/server/routers/app';
import { trpc } from '@/server/trpc/client';
import { useState, useEffect } from 'react';

export function useEventTickets(
  eventId: string,
  eventTicket: RouterOutputs['filterEvents']['getEvents']['events'][number]['eventTickets'][number],
) {
  const [eventDisabled, setEventDisabled] = useState(false);
  const [ticketsAvailable, setTicketsAvailable] = useState(0);

  const { data: ticketsEmited } =
    trpc.ticketGroup.getTicketsByEvent.useQuery(eventId);

  useEffect(() => {
    if (eventTicket === undefined || eventTicket === null || !eventTicket) {
      setEventDisabled(true);
      return;
    }
    const maxTickets = eventTicket.amount;

    if (maxTickets === undefined || maxTickets === null) {
      setEventDisabled(true);
      return;
    }

    if (ticketsEmited && ticketsEmited >= maxTickets) {
      setEventDisabled(true);
    } else if (ticketsEmited === undefined) {
      setEventDisabled(true);
    } else {
      setEventDisabled(false);
      setTicketsAvailable(maxTickets - ticketsEmited);
    }
  }, [eventTicket, ticketsEmited, eventId]);

  return { eventDisabled, ticketsAvailable };
}
