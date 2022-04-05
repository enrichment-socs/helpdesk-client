import { NavLink } from './NavLink';

export interface DropdownNavLink {
  title: string;
  href: string;
  roles: string[];
  children: NavLink[];
}
