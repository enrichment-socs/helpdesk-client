import { Ticket } from "./Ticket";

export class TicketHistory {
    public id: string;
    ticket: Ticket;
    public type: string;
    public data: string;
    public created_at: Date;
    public updated_at: Date;
}