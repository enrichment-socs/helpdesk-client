import ribbon from '../public/assets/ribbon.png';
import logo from '../public/assets/binus.png';
import Image from 'next/image';
import SemesterListBox from './SemesterListBox';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LogoutIcon } from '@heroicons/react/outline';
import { ROLES } from '../shared/constants/roles';
import { If, Else, Then } from 'react-if';
import DropdownNav from './_DropdownNav';
import { DropdownNavLink } from '../models/views/DropdownNavLink';
import { SessionUser } from '../models/SessionUser';
import { NavLink } from '../models/views/NavLink';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const links: (NavLink | DropdownNavLink)[] = [
    {
      title: 'Home',
      href: '/',
      roles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
    },
    {
      title: 'Cases',
      href: '/requests',
      roles: [ROLES.USER, ROLES.ADMIN],
    },
    {
      title: 'Informations',
      href: '/informations',
      roles: [ROLES.ADMIN],
    },
    {
      title: 'Manage',
      href: '/manage',
      roles: [ROLES.SUPER_ADMIN],
      children: [
        {
          title: 'Semesters',
          href: '/semesters',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Roles',
          href: '/roles',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Status',
          href: '/status',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'FAQ Categories',
          href: '/faq-categories',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Categories',
          href: '/categories',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Priorities',
          href: '/priorities',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Announcements',
          href: '/announcements',
          roles: [ROLES.SUPER_ADMIN],
        },
      ],
    },
  ];

  const router = useRouter();
  const session = useSession();
  const user = session.data.user as SessionUser;

  const logOut = async () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <div>
      <div className="flex justify-between items-center max-w-7xl px-2 sm:px-6 lg:px-8 mx-auto">
        <div className="flex">
          <div>
            <Image src={ribbon} height={110} width={38} alt="" />
          </div>
          <div className="ml-2 mt-1 ">
            <Image src={logo} height={85} width={130} alt="" />
          </div>
        </div>

        <div className="text-right mt-4">
          <div className="font-bold text-gray-600">
            Welcome, <span className="text-primary">{user.name}</span>
          </div>
          <div className="mt-2">
            <SemesterListBox />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mt-4"></div>

      <nav className="flex justify-between max-w-7xl px-2 sm:px-6 lg:px-8 mx-auto">
        <ul className="flex space-x-4">
          {links.map(
            (link) =>
              link.roles.includes(user?.roleName) && (
                <li key={link.title}>
                  <If condition={link.hasOwnProperty('children')}>
                    <Then>
                      <DropdownNav link={link as DropdownNavLink} />
                    </Then>
                    <Else>
                      <Link key={link.title} href={link.href} passHref={true}>
                        <div
                          className={`tracking-wide text-center cursor-pointer hover:text-primary min-w-[3rem] py-4 text-gray-600 font-semibold ${
                            router.pathname === link.href
                              ? 'border-b-2 border-primary font-bold'
                              : ''
                          }`}>
                          {link.title}
                        </div>
                      </Link>
                    </Else>
                  </If>
                </li>
              )
          )}
        </ul>

        <button
          onClick={() => logOut()}
          className="cursor-pointer hover:text-primary text-gray-600 font-bold flex space-x-1 items-center">
          <span className="block">Sign Out</span>{' '}
          <LogoutIcon className="w-5 h-5" />
        </button>
      </nav>

      <div className="border-b border-gray-200 mb-6"></div>
    </div>
  );
}
