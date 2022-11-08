export class CreateTicketResolutionDto {
  resolution: string;
  ticketId: string;
  conversationId: string;
  messageId?: string;
}
