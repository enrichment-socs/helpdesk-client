import { atom } from 'jotai';
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
  ticketsCountByCategories: atom<TicketCountByCategory[]>([]),
  ticketsCountByPriorities: atom<TicketCountByPriority[]>([]),
  ticketsCountByStatuses: atom<TicketCountByStatus[]>([]),
  ticketsCountByHandlers: atom<TicketCountByHandler[]>([]),
  ticketStatusCountByHandler: atom<TicketCountByStatus[]>([]),
  reportSemesterId: atom<string>(''),
  ticketsCountByMonths: atom<TicketCountByMonth[]>([]),
};

export default IndexStore;
