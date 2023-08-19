import logo from '@public/logo.svg';
import Link from 'next/link';
import ThemeSwitch from './ThemeSwitch';
import MobileNav from './MobileNav';
import Image from 'next/image';

const headerNavLinks = [
  { href: '/', id: 'shorten', title: 'Shorten' },
  { href: '#clicks', id: 'clicks', title: 'Click Statistics' },
  { href: '#terms', id: 'terms', title: 'Terms Of Service' },
  { href: '#contact', id: 'contact', title: 'Contact Us' }
];

const Nav = () => {
  const handleClickScroll = (event: any, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
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
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              onClick={(event) => handleClickScroll(event, link.id)}
              className='hidden sm:block font-medium text-gray-900 dark:text-gray-100'
            >
              {link.title}
            </Link>
          ))}
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  );
};

export default Nav;
