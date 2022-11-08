import { Ticket } from './Ticket';

export class TicketResolution {
  public id: string;
  ticket: Ticket;
  public resolution: string;
  public conversationId: string;
  public messageId: string;
  public created_at: Date;
  public updated_at: Date;
}
