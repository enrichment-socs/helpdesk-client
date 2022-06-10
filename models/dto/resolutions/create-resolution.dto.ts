export class CreateResolutionDto {
  resolution: string;
  caseId: string;
  sentToEmail: boolean;
  conversationId: string;
  ccRecipients: string;
  toRecipients: string;
  subject: string;
}
