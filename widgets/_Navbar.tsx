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
import NavbarNotification from './NavbarNotification';
import { ExternalLinkIcon } from '@heroicons/react/solid';

export default function Navbar() {
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const links: (NavLink | DropdownNavLink)[] = [
    {
      title: 'Home',
      href: '/',
      roles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
    },
    {
      title: 'Tickets',
      href: '/tickets',
      query: `?pendingPriority=&pendingQuery=${user?.name}&priority=&status=&query=${user?.name}`,
      roles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
    },
    {
      title: 'Informations',
      href: '/informations',
      roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    },
    {
      title: 'Manage',
      href: '/manage',
      roles: [ROLES.SUPER_ADMIN],
      children: [
        {
          title: 'Announcements',
          href: '/announcements',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Semesters',
          href: '/semesters',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Guideline Categories',
          href: '/guideline-categories',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Guidelines',
          href: '/guidelines',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Ticket Categories',
          href: '/categories',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Ticket Priorities',
          href: '/priorities',
          roles: [ROLES.SUPER_ADMIN],
        },
        {
          title: 'Users',
          href: '/users',
          roles: [ROLES.SUPER_ADMIN],
        },
      ],
    },
    {
      title: 'Guidelines',
      href: '/guidelines',
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    },
    {
      title: 'Company Recommendation',
      href: process.env.NEXT_PUBLIC_COMP_RECOM_URL,
      roles: [ROLES.ADMIN, ROLES.USER, ROLES.SUPER_ADMIN],
      isExternal: true,
    },
    {
      title: 'Consultation',
      href: process.env.NEXT_PUBLIC_CONSULTATION_URL,
      roles: [ROLES.ADMIN, ROLES.USER, ROLES.SUPER_ADMIN],
      isExternal: true,
    },
  ];

  const logOut = async () => {
    await signOut({ callbackUrl: process.env.NEXT_PUBLIC_LOGIN_ABSOLUTE_URL });
  };

  console.log({ router });
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center max-w-screen-2xl px-2 sm:px-6 lg:px-8 mx-auto">
        <div className="flex w-full">
          <div>
            <Image src={ribbon} height={110} width={38} alt="" />
          </div>
          <div className="ml-2 mt-1 ">
            <Image src={logo} height={85} width={130} alt="" />
          </div>
        </div>

        <div className="w-full text-right mt-4">
          <div className="font-bold text-gray-600">
            Welcome, <span className="text-primary">{user.name}</span>
          </div>
          <div className="mt-2">
            <SemesterListBox />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mt-4"></div>

      <nav className="flex justify-between max-w-screen-2xl px-2 sm:px-6 lg:px-8 mx-auto">
        <ul className="flex space-x-4 items-center">
          {links.map(
            (link) =>
              link.roles.includes(user?.roleName) && (
                <li key={link.title}>
                  {link.isExternal ? (
                    <a
                      className="tracking-wide text-center cursor-pointer hover:text-primary min-w-[3rem] py-4 text-gray-600 font-semibold"
                      href={`${link.href}?t=${user?.accessToken}`}
                      target="_blank"
                      rel="noreferrer">
                      {link.title}{' '}
                      <ExternalLinkIcon className="inline w-5 h-5" />
                    </a>
                  ) : (
                    <If condition={link.hasOwnProperty('children')}>
                      <Then>
                        <DropdownNav link={link as DropdownNavLink} />
                      </Then>
                      <Else>
                        <Link
                          key={link.title}
                          href={`${link.href}${link.query ?? ''}`}
                          passHref={true}>
                          {link.href === '/' ? (
                            <div
                              className={`tracking-wide text-center cursor-pointer hover:text-primary min-w-[3rem] py-4 text-gray-600 font-semibold ${
                                router.pathname === '/'
                                  ? 'border-b-2 border-primary font-bold'
                                  : ''
                              }`}>
                              {link.title}
                            </div>
                          ) : (
                            <div
                              className={`tracking-wide text-center cursor-pointer hover:text-primary min-w-[3rem] py-4 text-gray-600 font-semibold ${
                                router.pathname.includes(link.href) &&
                                router.pathname
                                  .split('/')[1]
                                  .toLowerCase()
                                  .includes(link.title.toLowerCase())
                                  ? 'border-b-2 border-primary font-bold'
                                  : ''
                              }`}>
                              {link.title}{' '}
                            </div>
                          )}
                        </Link>
                      </Else>
                    </If>
                  )}
                </li>
              )
          )}
        </ul>

        <div className="flex space-x-4">
          <NavbarNotification />

          <button
            onClick={() => logOut()}
            className="cursor-pointer hover:text-primary text-gray-600 font-bold flex space-x-1 items-center">
            <span className="hidden md:block">Sign Out</span>{' '}
            <LogoutIcon className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="border-b border-gray-200 mb-6"></div>
    </div>
  );
}
