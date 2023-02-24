import { atom } from 'jotai';
import { Announcement } from '../models/Announcement';
import { Message } from '../models/Message';
import { TicketCountByCategory } from '../models/reports/TicketCountByCategory';
import { TicketCountByHandler } from '../models/reports/TicketCountByHandler';
import { TicketCountByMonth } from '../models/reports/TicketCountByMonth';
import { TicketCountByPriority } from '../models/reports/TicketCountByPriority';
import { TicketCountByStatus } from '../models/reports/TicketCountByStatus';
import { User } from '../models/User';

const IndexStore = {
  messages: atom<Message[]>([]),
  totalMessagesCount: atom<number>(0),
  skipCount: atom<number>(0),

  unmarkedMessages: atom<Message[]>([]),
  unmarkedMessagesCount: atom<number>(0),
  unmarkedSkipCount: atom<number>(0),

  ticketsCountByCategories: atom<TicketCountByCategory[]>([]),
  ticketsCountByPriorities: atom<TicketCountByPriority[]>([]),
  ticketsCountByStatuses: atom<TicketCountByStatus[]>([]),
  ticketsCountByMonths: atom<TicketCountByMonth[]>([]),
  ticketsCountByHandlers: atom<TicketCountByHandler[]>([]),
  reportSemesterId: atom<string>(''),
  handlerReportSemesterId: atom<string>(''),
  admins: atom<User[]>([]),

  handlerTicketsCountByCategories: atom<TicketCountByCategory[]>([]),
  handlerTicketsCountByPriorities: atom<TicketCountByPriority[]>([]),
  handlerTicketsCountByStatuses: atom<TicketCountByStatus[]>([]),
  handlerTicketsCountByMonths: atom<TicketCountByMonth[]>([]),

  announcements: atom<Announcement[]>([]),
  announcementsCount: atom<number>(0),
  announcementsSkip: atom<number>(0),
};

export default IndexStore;
