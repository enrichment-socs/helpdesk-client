import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DropdownNavLink } from '../models/views/DropdownNavLink';

type Props = {
  link: DropdownNavLink;
};

export default function DropdownNav({ link }: Props) {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setOpenDropdown(true);
      }}
      onMouseLeave={() => setOpenDropdown(false)}
      className={`relative tracking-wide text-center cursor-pointer hover:text-primary min-w-[3rem] py-4 text-gray-600 font-semibold ${
        router.pathname.includes(link.href)
          ? 'border-b-2 border-primary font-bold'
          : ''
      }`}>
      {link.title}

      <ul
        className={`absolute bg-white border border-gray-200 rounded-md shadow top-12 transition-all duration-300 ${
          openDropdown ? 'block z-10' : 'hidden'
        }`}>
        {link.children
          ?.sort((first, second) => first.title.localeCompare(second.title))
          .map((child) => (
            <li key={child.title} className="w-44 hover:bg-gray-50">
              <Link href={`${link.href}${child.href}`} passHref={true}>
                <div
                  className={`tracking-wide text-left cursor-pointer hover:text-primary p-4 text-gray-600 font-semibold ${
                    router.pathname.includes(link.href) &&
                    router.pathname.includes(child.href)
                      ? 'font-bold text-primary'
                      : ''
                  }`}>
                  {child.title}
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
