export class Message {
  id: string;
  messageId: string;
  sender: string;
  subject: string;
  receivedDateTime: Date;
  bodyPreview: string;
  conversationId: string;
  conversationIndex: string;
  savedAs: string;
  public createdAt: Date;
}
