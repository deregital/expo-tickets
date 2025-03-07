import Image from 'next/image';

interface CardEventProps {
  title: string;
  date: string;
  month: string;
  year: string;
  time: string;
  imageUrl: string;
}

function CardEvent({
  title = 'Expo Entrenamiento 6',
  date = '29',
  month = 'Jun',
  year = '2025',
  time = '15:00',
  imageUrl = '/Foto.png',
}: CardEventProps) {
  return (
    <div className='bg-white rounded-[20px] overflow-hidden drop-shadow-md hover:shadow-[0_0_15px_8px_rgba(0,0,0,0.1)] hover:cursor-pointer transition-all duration-300 w-[240px]'>
      <div className='relative h-[180px] w-full bg-MiExpo_purple/10'>
        <Image src={imageUrl} alt={title} fill className='object-cover' />
      </div>
      <div className='px-4 py-8 font-sans'>
        <h3 className='text-[18px] font-light text-black mb-5'>{title}</h3>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex flex-col items-center'>
              <span className='text-[32px] font-bold text-black leading-[100%]'>
                {date}
              </span>
              <div className='flex flex-col items-center'>
                <span className='text-[14px] leading-[100%] text-black'>
                  {month}
                </span>
                <span className='text-[12px] leading-[100%] text-black'>
                  {year}
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-0.5'>
            <span className='text-[24px] leading-[100%] font-semibold text-black'>
              {time}
            </span>
            <span className='text-[12px] leading-[100%] text-black self-end mb-1'>
              hs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardEvent;
