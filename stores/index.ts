import { atom } from 'jotai';
import { Message } from '../models/Message';
import { TicketCountByCategory } from '../models/reports/TicketCountByCategoryt';

const IndexStore = {
  messages: atom<Message[]>([]),
  totalMessagesCount: atom<number>(0),
  skipCount: atom<number>(0),
  ticketsCountByCategories: atom<TicketCountByCategory[]>([]),
};

export default IndexStore;
