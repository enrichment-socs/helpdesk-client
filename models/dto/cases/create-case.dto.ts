export interface CreateCaseDto {
  conversationId: string;
  assignedToId: string;
  statusId: string;
  categoryId: string;
  semesterId: string;
  priorityId: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  dueBy: Date;
}
