import GridEvents from '@/components/Events/GridEvents';
import Filter from '@/components/Filter/FilterEvents';

export default function Home() {
  return (
    <div className='bg-MiExpo_white h-screen flex flex-col gap-4'>
      <Filter />
      <GridEvents />
    </div>
  );
}
