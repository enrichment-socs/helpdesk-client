import { MutableRefObject } from 'react';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../../models/OutlookMessageAttachment';
import MessageAttachmentList from '../../../widgets/MessageAttachmentList';
import TicketDetailConversationAction from './TicketDetailConversationAction';

type Props = {
  message: OutlookMessage;
  attachments: OutlookMessageAttachmentValue[];
  useUniqueBody?: boolean;
  canBeReplied?: boolean;
  canBeMarkedAsResolution?: boolean;
  replyComponentRef?: MutableRefObject<HTMLFormElement>;
};

const TicketDetailConversationBody = ({
  message,
  attachments,
  useUniqueBody = true,
  canBeReplied = false,
  canBeMarkedAsResolution = false,
  replyComponentRef = null,
}: Props) => {
  return (
    <div className="pt-2">
      <div>
        <div
          className="max-h-[42rem] overflow-auto"
          dangerouslySetInnerHTML={{
            __html: useUniqueBody
              ? message.uniqueBody.content
              : message.body.content,
          }}></div>

        {message.hasAttachments && (
          <div className="border-t border-gray-300 mt-4">
            <h3 className="font-semibold text-sm mt-4">Attachments</h3>

            {attachments && <MessageAttachmentList attachments={attachments} />}
          </div>
        )}
      </div>

      <TicketDetailConversationAction
        message={message}
        canBeMarkedAsResolution={canBeMarkedAsResolution}
        canBeReplied={canBeReplied}
        replyComponentRef={replyComponentRef}
      />
    </div>
  );
};

export default TicketDetailConversationBody;
