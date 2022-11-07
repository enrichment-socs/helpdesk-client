export class CreateTicketResolutionDto {
  resolution: string;
  ticketId: string;
  sentToEmail: boolean;
  conversationId: string;
  ccRecipients: string;
  toRecipients: string;
  subject: string;
  messageId?: string;
}
