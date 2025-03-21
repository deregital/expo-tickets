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

function TicketPurchase({
  eventTickets,
  eventId,
}: {
  eventTickets: RouterOutputs['filterEvents']['getEvents']['events'][number]['eventTickets'];
  eventId: string;
}) {
  const [quantity, setQuantity] = useState('1');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePurchase = () => {
    if (quantity === '0') return;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          ${eventTickets?.[0]?.price ? eventTickets[0].price : 0}
        </div>
        <div className='flex justify-end'>
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger className='w-24 bg-white text-MiExpo_black border border-MiExpo_gray'>
              <SelectValue placeholder='1' />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botón de compra */}
      <div className='mt-4 grid grid-cols-3'>
        <Button
          className='bg-MiExpo_purple cursor-pointer col-span-1 hover:bg-MiExpo_purple/90 text-MiExpo_white font-medium text-[12px] sm:text-[16px] leading-[100%] px-8 py-2 rounded-[10px]'
          onClick={handlePurchase}
          disabled={quantity === '0'}
        >
          COMPRAR
        </Button>
      </div>

      {/* Disclaimer - usando margin-top auto para empujar al fondo */}
      <div className='mt-auto pt-8 font-sans font-normal text-[12px] leading-[100%] text-black'>
        <p>
          Disclaimer del evento o la compra de entrada: Lorem ipsum dolor sit
          amet consectetur. Commodo porttitor et ut risus. In convallis vivamus
          felis aliquam tristique dolor odio tortor ornare. Consectetur suscipit
          at ipsum proin id dictum. Tortor quisque risus volutpat purus sit nec
          ornare et.
        </p>
      </div>

      {/* Modal de compra de tickets */}
      <TicketPurchaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        quantity={quantity}
        price={eventTickets?.[0]?.price ? eventTickets[0].price : 0}
        eventId={eventId}
        ticketType={eventTickets?.[0]?.type || 'PARTICIPANT'}
      />
    </div>
  );
}

export default TicketPurchase;
