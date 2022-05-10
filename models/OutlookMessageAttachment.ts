export class OutlookMessageAttachment {
  value: OutlookMessageAttachmentValue[];
}

export class OutlookMessageAttachmentValue {
  id: string;
  lastModifiedDateTime: string;
  name: string;
  contentType: string;
  size: number;
  isInline: boolean;
  contentId: string;
  contentBytes: string;
}
