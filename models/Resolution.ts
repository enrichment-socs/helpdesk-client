import { Case } from './Case';

export class Resolution {
  public id: string;
  case: Case;
  public resolution: string;
  public sentToEmail: boolean;
  public subject: string;
  public toRecipients: string;
  public ccRecipients: string;
  public conversationId: string;
  public messageId: string;
  public created_at: Date;
  public updated_at: Date;
}
