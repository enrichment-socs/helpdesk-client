export interface AddAttachmentDto {
  contentBytes: string;
  contentType: string;
  name: string;
  size: number;
  isInline: boolean;
}
