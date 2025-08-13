import { cookies } from 'next/headers';
import MiExpo_Logo from './MiExpo_Logo';
import Navbar from './Navbar';
import { redirect } from 'next/navigation';

// [N]
async function logout() {
  'use server';
  const cookieStore = await cookies();
  cookieStore.delete('loggedIn');
  cookieStore.delete('mail');
  cookieStore.delete('password');
  cookieStore.delete('loggedInDate');
  redirect('/admin/login');
}
// [/N]

async function TopBar() {
  // [N]
  const cookieStore = await cookies();
  const loggedIn = cookieStore.get('loggedIn');
  // [/N]

  return (
    <div className='bg-MiExpo_black w-full lg:h-[16vh] md:h-[12vh] h-[8vh] flex items-center pl-[20px] md:pl-[50px]'>
      <MiExpo_Logo />
      <Navbar />

      {/* [N] */}
      {loggedIn && (
        <form className='flex w-full justify-end' action={logout}>
          <button
            className='text-MiExpo_white mr-5 px-4 py-2 rounded-md bg-MiExpo_purple hover:bg-MiExpo_purple/80 transition-all duration-300 cursor-pointer'
            type='submit'
          >
            Cerrar Sesión
          </button>
        </form>
      )}
      {/* [/N] */}
    </div>
  );
}

export default TopBar;
