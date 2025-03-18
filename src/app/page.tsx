import GridEvents from '@/components/Events/GridEvents';
import Filter from '@/components/Filter/FilterEvents';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className='bg-MiExpo_white h-screen flex flex-col gap-4'>
      <Suspense>
        <Filter />
        <GridEvents />
      </Suspense>
    </div>
  );
}
