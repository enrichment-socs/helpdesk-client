import { atom } from 'jotai';
import { Priority } from '../../models/Priority';
import { Status } from '../../models/Status';
import { Ticket } from '../../models/Ticket';

const TicketStore = {
  tickets: atom<Ticket[]>([]),
  skip: atom<number>(0),
  pendingTickets: atom<Ticket[]>([]),
  pendingSkip: atom<number>(0),
  statuses: atom<Status[]>([]),
  priorities: atom<Priority[]>([]),
  count: atom<number>(0),
  pendingCount: atom<number>(0),
};

export default TicketStore;
