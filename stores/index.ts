import { atom } from 'jotai';
import { Message } from '../models/Message';
import { TicketCountByCategory } from '../models/reports/TicketCountByCategory';
import { TicketCountByHandler } from '../models/reports/TicketCountByHandler';
import { TicketCountByPriority } from '../models/reports/TicketCountByPriority';
import { TicketCountByStatus } from '../models/reports/TicketCountByStatus';

const IndexStore = {
  messages: atom<Message[]>([]),
  totalMessagesCount: atom<number>(0),
  skipCount: atom<number>(0),
  ticketsCountByCategories: atom<TicketCountByCategory[]>([]),
  ticketsCountByPriorities: atom<TicketCountByPriority[]>([]),
  ticketsCountByStatuses: atom<TicketCountByStatus[]>([]),
  ticketsCountByHandlers: atom<TicketCountByHandler[]>([]),
};

export default IndexStore;
