export interface ReplyMessageDto {
  message: {
    body: {
      contentType: string;
      content: string;
    };
    toRecipients: {
      emailAddress: {
        name: string;
        address: string;
      };
    }[];
    ccRecipients: {
      emailAddress: {
        name: string;
        address: string;
      };
    }[];
  };
}
