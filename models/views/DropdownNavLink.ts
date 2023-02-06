import { NavLink } from './NavLink';

export interface DropdownNavLink {
  title: string;
  href: string;
  roles: string[];
  query?: string;
  isExternal?: boolean;
  children: NavLink[];
}
