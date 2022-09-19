export interface ReplyMessageDto {
  message: {
    body: {
      contentType: string;
      content: string;
    };
    toRecipients: {
      emailAddress: {
        address: string;
      };
    }[];
    ccRecipients: {
      emailAddress: {
        address: string;
      };
    }[];
  };
}
