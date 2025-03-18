import { MapPin } from 'lucide-react';
import { type RouterOutputs } from '@/server/routers/app';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function HeaderTickets({
  event,
}: {
  event: RouterOutputs['filterEvents']['getEvents']['events'][number];
}) {
  // Formatear la fecha para mostrarla en español
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEEE d 'de' MMMM yyyy", { locale: es });
  };

  // Formatear la hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm 'hrs.'", { locale: es });
  };

  const formattedDate = formatDate(event.date);
  const formattedTime = formatTime(event.startingDate);

  return (
    <div className='grid grid-cols-1 md:grid-cols-16 w-full h-full overflow-hidden'>
      {/* Lado izquierdo - Nombre del evento y fecha */}
      <div className='col-span-1 md:col-span-12 px-6 py-4 flex flex-col justify-center overflow-hidden'>
        <h1 className='text-3xl font-bold text-black truncate'>{event.name}</h1>
        <p className='text-MiExpo_purple mt-2 whitespace-nowrap overflow-hidden text-ellipsis'>
          {formattedDate} - {formattedTime}
        </p>
      </div>

      {/* Lado derecho - Ubicación */}
      <div className='col-span-1 md:col-span-4 px-6 py-4 flex items-center justify-start md:border-l border-[#A3A3A3] overflow-hidden'>
        <div className='flex items-start min-w-0'>
          <div className='flex items-center justify-center mr-2'>
            <MapPin
              className='text-black flex-shrink-0 h-full'
              height={72}
              width={36}
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
