import { atom } from 'jotai';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../../models/OutlookMessageAttachment';
import { Status } from '../../../models/Status';
import { Ticket } from '../../../models/Ticket';
import { TicketDueDate } from '../../../models/TicketDueDate';
import { TicketResolution } from '../../../models/TicketResolution';
import { TicketStatus } from '../../../models/TicketStatus';

const TicketDetailStore = {
  ticket: atom<Ticket>(null),
  resolution: atom<TicketResolution>(null),
  ticketStatuses: atom<TicketStatus[]>([]),
  ticketDueDates: atom<TicketDueDate[]>([]),
  statuses: atom<Status[]>([]),
  outlookMessages: atom<OutlookMessage[]>(null),
  attachmentsArray: atom<OutlookMessageAttachmentValue[][]>([]),
};

export default TicketDetailStore;
