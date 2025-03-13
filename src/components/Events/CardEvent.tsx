import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

interface CardEventProps {
  id: string;
  title: string;
  dayOfWeek: string;
  date: string;
  month: string;
  year: string;
  time: string;
  imageUrl: string;
}

function CardEvent({
  id,
  title = 'Expo Entrenamiento 2',
  dayOfWeek = 'Dom',
  date = '16',
  month = 'Mar',
  year = '2025',
  time = '15:00',
  imageUrl = '/Foto.png',
}: CardEventProps) {
  return (
    <Link href={`/${id}`}>
      <div className='bg-white rounded-[20px] overflow-hidden drop-shadow-md hover:shadow-[0_0_15px_8px_rgba(0,0,0,0.1)] hover:cursor-pointer transition-all duration-300 w-[240px]'>
        <div className='relative h-[180px] w-full bg-MiExpo_purple/10'>
          <Image src={imageUrl} alt={title} fill className='object-cover' />
        </div>
        <div className='px-4 py-8 font-sans'>
          <h3 className='text-[18px] font-light text-black mb-5'>{title}</h3>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                <span className='text-xs text-gray-600'>{dayOfWeek}</span>
                <span className='text-2xl font-bold'>{date}</span>
                <div className='flex flex-col'>
                  <span className='text-[10px]'>{month}</span>
                  <span className='text-[10px]'>{year}</span>
                </div>
              </div>
              <Calendar size={16} />
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                <span className='text-2xl font-bold'>
                  {time.split(':')[0]}{' '}
                </span>
                <div className='flex flex-col'>
                  <span className='text-[10px]'>
                    {time.includes(':') ? time.split(':')[1] : '00'}
                  </span>
                  <span className='text-[10px]'>hs</span>
                </div>
              </div>
              <Clock size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CardEvent;
