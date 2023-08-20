import logo from '@public/logo.svg';
import Link from 'next/link';
import Image from 'next/image';

const Nav = () => {
  return (
    <header className='flex items-center justify-between py-6 px-6 max-w-[1000px] mx-auto'>
      <div>
        <Link href='/' aria-label='oGo URL Shortener'>
          <div className='flex items-center justify-between'>
            <div className='mr-3'>
              <Image
                src={logo}
                alt='oGo URL Shortener Logo'
                width={40}
                height={40}
              />
            </div>

            <div className='hidden text-xl font-semibold lg:block'>
              <span>oGo Free URL Shortener</span>
            </div>
          </div>
        </Link>
      </div>
      <div className='flex items-center leading-5 space-x-4 sm:space-x-6'>
        {new Date().getFullYear()} ©ogo.gl All Rights Reserved.
      </div>
    </header>
  );
};

export default Nav;
