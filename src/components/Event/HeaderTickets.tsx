import { MapPin } from 'lucide-react';
import { type RouterOutputs } from '@/server/routers/app';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function HeaderTickets({
  event,
}: {
  event: RouterOutputs['filterEvents']['getEvents']['events'][number];
}) {
  // Formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEEE d 'de' MMMM yyyy - HH:mm 'hrs.'", {
      locale: es,
    });
  };

  const formattedDate = formatDate(event.startingDate);

  return (
    <div className='grid grid-cols-1 md:grid-cols-16 w-full h-full overflow-hidden'>
      {/* Lado izquierdo - Nombre del evento y fecha */}
      <div className='col-span-1 md:col-span-12 md:px-6 md:py-4 px-4 py-2 flex flex-col justify-center overflow-hidden'>
        <h1 className='text-2xl md:text-3xl font-bold text-black truncate'>
          {event.name}
        </h1>
        <p className='text-MiExpo_purple capitalize mt-2 whitespace-nowrap overflow-hidden text-sm md:text-base text-ellipsis'>
          {formattedDate}
        </p>
      </div>

      {/* Lado derecho - Ubicación */}
      <div className='col-span-1 md:col-span-4 md:px-6 md:py-4 px-4 py-2 flex items-center justify-start md:border-l border-[#A3A3A3] overflow-hidden'>
        <div className='flex items-start min-w-0'>
          <div className='flex items-center justify-center mr-2'>
            <MapPin
              className='text-black flex-shrink-0 h-full sm:h-[36px] sm:w-[36px] md:h-[72px] md:w-[36px]'
              height={24}
              width={24}
              strokeWidth={1.5}
            />
          </div>
          <div className='text-sm md:text-base h-full min-w-0'>
            <p className='font-semibold text-black truncate'>
              {event.location}
            </p>
            <p className='text-gray-600 truncate'>{event.location}</p>
            <p className='text-gray-600 truncate'>
              {event.location}, {event.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderTickets;
