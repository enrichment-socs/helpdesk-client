import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { If, Then } from 'react-if';
import { OutlookMessage } from '../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../models/OutlookMessageAttachment';
import { SessionUser } from '../../models/SessionUser';
import { GraphApiService } from '../../services/GraphApiService';
import { CONTENT_ID_REGEX } from '../../shared/constants/regex';
import { OutlookMessageClientHelper } from '../../shared/libs/outlook-message-client-helper';
import MessageAttachmentList from '../../widgets/MessageAttachmentList';

type Props = {
  messages: OutlookMessage[];
};

type MessageAttachmentsDictionary = {
  messageId: string;
  attachments: OutlookMessageAttachmentValue[];
};

export default function InformationDetailModalConversations({
  messages,
}: Props) {
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user?.accessToken);
  const [processedMessage, setProcessedMessage] = useState<OutlookMessage[]>(
    []
  );
  const [messageAttachmentDictionary, setMessageAttachmentDictionary] =
    useState<MessageAttachmentsDictionary[]>([]);

  useEffect(() => {
    const processAllMessages = async () => {
      const processedMessageResult: OutlookMessage[] = [];
      const tempMessageAttachmentsDict: MessageAttachmentsDictionary[] = [];
      for (const message of messages) {
        const { processedMessage, attachments } = await processMessage(message);
        processedMessageResult.push(processedMessage);
        tempMessageAttachmentsDict.push({
          messageId: message.id,
          attachments,
        });
      }

      setProcessedMessage(processedMessageResult);
      setMessageAttachmentDictionary(tempMessageAttachmentsDict);
    };

    processAllMessages();
  }, [messages]);

  const processMessage = async (message: OutlookMessage) => {
    const bodyContent = message.uniqueBody.content;
    const contentIds = bodyContent.match(CONTENT_ID_REGEX);

    let attachments: OutlookMessageAttachmentValue[] = [];
    if (contentIds || message.hasAttachments) {
      const messageAttachment = await graphApiService.getMessageAttachments(
        message.id
      );
      attachments = messageAttachment.value;

      const outlookMessageClientHelper = new OutlookMessageClientHelper(
        message
      );
      const processedBodyContent =
        outlookMessageClientHelper.replaceBodyImageWithCorrectSource(
          messageAttachment.value
        );

      message.uniqueBody.content = processedBodyContent;
    }

    return {
      processedMessage: message,
      attachments: attachments.filter((att) => !att.isInline),
    };
  };

  const getAttachments = (message: OutlookMessage) => {
    const dict = messageAttachmentDictionary.find(
      (m) => m.messageId === message.id
    );
    return dict.attachments;
  };

  const containAttachments = (message: OutlookMessage) => {
    return (
      messageAttachmentDictionary.find(
        (dict) => dict.messageId === message.id && dict.attachments.length > 0
      ) !== undefined
    );
  };

  return (
    <div className="border border-gray-200 rounded mt-4">
      <div className="bg-gray-300 text-gray-700 p-2">Conversations</div>

      <ul className="bg-white border border-gray-200 text-gray-900 max-h-[42rem] overflow-auto">
        {processedMessage.map((message) => (
          <li
            key={message.id}
            className="m-4 p-4 border border-gray-300 rounded">
            <div className="text-sm">
              <div>
                <b>From:</b> {message.sender.emailAddress.address}
              </div>
              <div>
                <b>Sent:</b>{' '}
                {format(
                  new Date(message.receivedDateTime),
                  'EEEE, dd MMM yyyy kk.mm'
                )}
              </div>
              <div>
                <b>To:</b>{' '}
                {message.toRecipients
                  .map((recipient) => recipient.emailAddress.address)
                  .join(', ')}
              </div>
              <If condition={message.ccRecipients.length > 0}>
                <Then>
                  <div>
                    <b>Cc:</b>{' '}
                    {message.ccRecipients
                      .map((recipient) => recipient.emailAddress.address)
                      .join(', ')}
                  </div>
                </Then>
              </If>
              <div>
                <b>Subject:</b> {message.subject || 'No Subject'}
              </div>
            </div>

            <div
              className="mt-4"
              dangerouslySetInnerHTML={{
                __html: message.uniqueBody.content,
              }}></div>

            {containAttachments(message) && (
              <div className="border-t border-gray-300 mt-4">
                <h3 className="font-semibold text-sm mt-4">Attachments</h3>
                <MessageAttachmentList attachments={getAttachments(message)} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
