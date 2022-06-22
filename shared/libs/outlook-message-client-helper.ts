import { OutlookMessage } from '../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../models/OutlookMessageAttachment';
import { CONTENT_ID_REGEX } from '../constants/regex';

export class OutlookMessageClientHelper {
  private readonly message: OutlookMessage;

  constructor(message: OutlookMessage) {
    this.message = message;
  }

  public replaceBodyImageWithCorrectSource(
    attachments: OutlookMessageAttachmentValue[],
    useUniqueBody: boolean = false
  ) {
    let content = useUniqueBody
      ? this.message.uniqueBody.content
      : this.message.body.content;
    const contentIds = content.match(CONTENT_ID_REGEX);

    attachments
      .filter(
        (att) => att.isInline && contentIds.includes(`cid:${att.contentId}`)
      )
      .forEach((attachment) => {
        content = content.replaceAll(
          `cid:${attachment.contentId}`,
          `data:image/jpeg;base64,${attachment.contentBytes}`
        );
      });
    return content;
  }
}
