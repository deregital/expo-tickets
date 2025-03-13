import { MapPin } from 'lucide-react';
import { type Event } from '@/types/event';

function HeaderTickets({ event }: { event: Event }) {
  // Formatear la fecha para mostrarla en español
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Obtener el día de la semana
    const weekdays = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const dayOfWeek = weekdays[date.getDay()];

    // Obtener el día del mes
    const day = date.getDate();

    // Obtener el mes
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const month = months[date.getMonth()];

    // Obtener el año
    const year = date.getFullYear();

    // Formatear la fecha como "Domingo 15 de junio 2025"
    return `${dayOfWeek} ${day} de ${month} ${year}`;
  };

  // Formatear la hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} hrs.`;
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
