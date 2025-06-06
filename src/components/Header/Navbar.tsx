'use client';

import { useRouter } from 'next/navigation';

function Navbar() {
  const router = useRouter();

  return (
    <div className='pl-10 sm:pl-14 flex items-center gap-x-[40px] sm:gap-x-[80px]'>
      <h3
        onClick={() => router.push('/')}
        className='hover:cursor-pointer text-MiExpo_white text-[1rem] sm:text-[1.2rem] lg:text-[1.5rem] font-sans leading-[32px] relative group'
      >
        Eventos
        <span className='absolute bottom-0 left-0 w-0 h-[2px] bg-MiExpo_white transition-all duration-300 group-hover:w-full'></span>
      </h3>
    </div>
  );
}

export default Navbar;
