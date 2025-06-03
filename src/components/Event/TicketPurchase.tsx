'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TicketPurchaseModal from './TicketPurchaseModal';
import { type RouterOutputs } from '@/server/routers/app';
import { TICKET_INFORMATION } from '@/constants';
import { trpc } from '@/server/trpc/client';
import { useEventTickets } from '@/hooks/useEventTickets';
import ErrorModal from './ErrorModal';

function TicketPurchase({
  eventTicket,
  eventId,
}: {
  eventTicket: RouterOutputs['filterEvents']['getEvents']['events'][number]['eventTickets'][number];
  eventId: string;
}) {
  const [quantity, setQuantity] = useState('1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ticketGroupId, setTicketGroupId] = useState<
    RouterOutputs['ticketGroup']['create']['id'] | null
  >(null);
  const { ticketsAvailable } = useEventTickets(eventId, eventTicket);
  const createTicketGroup = trpc.ticketGroup.create.useMutation({
    onError: (error) => {
      setShowErrorModal(true);
      setErrorMessage(error.message);
    },
  });
  const deleteTicketGroup = trpc.ticketGroup.delete.useMutation();

  const handlePurchase = async () => {
    if (quantity === '0') return;
    if (ticketsAvailable < parseInt(quantity)) return;

    await createTicketGroup
      .mutateAsync({
        eventId,
        amountTickets: parseInt(quantity),
      })
      .then((ticketGroupData) => {
        setTicketGroupId(ticketGroupData.id);
      });

    setIsModalOpen(true);
  };

  const handleCloseModal = async (bought: boolean) => {
    setIsModalOpen(false);
    if (!bought && ticketGroupId) {
      await deleteTicketGroup.mutateAsync(ticketGroupId).then(() => {
        setTicketGroupId(null);
      });
    }
  };

  return (
    <div className='rounded-[20px] border border-MiExpo_gray p-6 bg-white h-full flex flex-col font-sans'>
      {/* Encabezado de la tabla */}
      <div className='grid grid-cols-3 pb-2 border-b border-MiExpo_gray'>
        <div className='text-MiExpo_black text-[12px] sm:text-[16px] font-normal leading-[100%]'>
          Tipo de Ticket
        </div>
        <div className='text-MiExpo_black text-[12px] sm:text-[16px] font-normal leading-[100%] text-center'>
          Valor
        </div>
        <div className='text-MiExpo_black text-[12px] sm:text-[16px] font-normal leading-[100%] text-right'>
          Cantidad
        </div>
      </div>

      {/* Fila de ticket */}
      <div className='grid grid-cols-3 py-4 items-center'>
        <div className='text-MiExpo_black text-[12px] sm:text-[16px] font-normal leading-[100%]'>
          {TICKET_INFORMATION.name}
        </div>
        <div className='text-MiExpo_black text-[12px] sm:text-[16px] font-normal leading-[100%] text-center'>
          ${eventTicket?.price ? eventTicket.price : 0}
        </div>
        <div className='flex justify-end'>
          {ticketsAvailable > 0 ? (
            <Select value={quantity} onValueChange={setQuantity}>
              <SelectTrigger className='w-24 bg-white text-MiExpo_black border border-MiExpo_gray'>
                <SelectValue placeholder='1' />
              </SelectTrigger>
              <SelectContent align='end'>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className='text-red-500 font-medium text-[12px] sm:text-[16px]'>
              Entradas agotadas!
            </div>
          )}
        </div>
      </div>

      {/* Botón de compra */}
      <div className='mt-4 grid grid-cols-3'>
        <Button
          className={`bg-MiExpo_purple cursor-pointer col-span-1 hover:bg-MiExpo_purple/90 text-MiExpo_white font-medium text-[12px] sm:text-[16px] leading-[100%] px-8 py-2 rounded-[10px] ${
            ticketsAvailable === 0
              ? 'opacity-50 cursor-not-allowed bg-red-500'
              : ''
          }`}
          onClick={handlePurchase}
          disabled={
            ticketsAvailable < parseInt(quantity) || ticketsAvailable === 0
          }
        >
          {ticketsAvailable ? 'COMPRAR' : 'AGOTADO'}
        </Button>
      </div>

      {/* Modal de compra de tickets */}
      <TicketPurchaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        quantity={quantity}
        price={eventTicket.price}
        eventId={eventId}
        ticketType={eventTicket.type}
        ticketGroupId={ticketGroupId || ''}
      />
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorTitle={'No se pudo reservar los tickets'}
        errorMessage={errorMessage}
      />
    </div>
  );
}

export default TicketPurchase;
