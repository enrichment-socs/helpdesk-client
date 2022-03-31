import ribbon from '../../public/assets/ribbon.png';
import logo from '../../public/assets/binus.png';
import Image from 'next/image';
import SemesterListBox from './SemesterListBox';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LogoutIcon } from '@heroicons/react/outline';

export default function Navbar() {
  const links = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Requests',
      href: '/requests',
    },
    {
      title: 'FAQ',
      href: '/faq',
    },
  ];

  const router = useRouter();

  return (
    <div>
      <div className='flex justify-between items-center max-w-7xl px-2 sm:px-6 lg:px-8 mx-auto'>
        <div className='flex'>
          <div>
            <Image src={ribbon} height={110} width={38} alt='' />
          </div>
          <div className='ml-2 mt-1 '>
            <Image src={logo} height={85} width={130} alt='' />
          </div>
        </div>

        <div className='text-right mt-4'>
          <div className='font-bold text-gray-600'>
            Welcome, <span className='text-primary'>Lionel Ritchie</span>
          </div>
          <div className='mt-2'>
            <SemesterListBox />
          </div>
        </div>
      </div>

      <div className='border-b border-gray-200 mt-4'></div>

      <nav className='flex justify-between max-w-7xl px-2 sm:px-6 lg:px-8 mx-auto'>
        <ul className='flex space-x-4'>
          {links.map((link) => (
            <Link key={link.title} href={link.href} passHref={true}>
              <li
                className={`tracking-wide text-center cursor-pointer hover:text-primary min-w-[3rem] py-4 text-gray-600 font-semibold ${
                  router.pathname === link.href
                    ? 'border-b-2 border-primary font-bold'
                    : ''
                }`}>
                {link.title}
              </li>
            </Link>
          ))}
        </ul>

        <button className='cursor-pointer hover:text-primary text-gray-600 font-bold flex space-x-1 items-center'>
          <span className='block'>Sign Out</span>{' '}
          <LogoutIcon className='w-5 h-5' />
        </button>
      </nav>

      <div className='border-b border-gray-200 mb-6'></div>
    </div>
  );
}
