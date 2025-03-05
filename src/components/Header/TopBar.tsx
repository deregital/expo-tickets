import MiExpo_Logo from './MiExpo_Logo';
import Navbar from './Navbar';

function TopBar() {
  return (
    <div className='bg-MiExpo_black w-full h-[16vh] flex items-center pl-[50px]'>
      <MiExpo_Logo />
      <Navbar />
    </div>
  );
}

export default TopBar;
