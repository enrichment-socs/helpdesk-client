import { format } from 'date-fns';
import { If, Then } from 'react-if';
import { OutlookMessage } from '../../models/OutlookMessage';

type Props = {
  messages: OutlookMessage[];
};

export default function InformationDetailModalConversations({
  messages,
}: Props) {
  console.log(messages);
  return (
    <div className="border border-gray-200 rounded mt-4">
      <div className="bg-gray-300 text-gray-700 p-2">Conversations</div>

      <ul className="bg-white border border-gray-200 text-gray-900 max-h-[42rem] overflow-auto">
        {messages.map((message) => (
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
          </li>
        ))}
      </ul>
    </div>
  );
}
