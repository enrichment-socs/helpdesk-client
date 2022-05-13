import { format } from 'date-fns';
import { OutlookMessage } from '../../models/OutlookMessage';
import SkeletonLoading from '../../widgets/SkeletonLoading';

type Props = {
  message: OutlookMessage;
};

export default function MessageDetailModalHeader({ message }: Props) {
  const getSenderInfo = () => {
    return message ? (
      message.sender.emailAddress.address
    ) : (
      <SkeletonLoading width="100%" />
    );
  };

  const getToRecipientsInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;

    const recipients = message.toRecipients
      .map((recipient) => recipient.emailAddress.address)
      .join(', ');

    return recipients || '-';
  };

  const getCcRecipientsInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;

    const recipients = message.ccRecipients
      .map((recipient) => recipient.emailAddress.address)
      .join(', ');

    return recipients || '-';
  };

  const getReceivedDateTimeInfo = () => {
    return message ? (
      format(new Date(message.receivedDateTime), 'dd MMM yyy, kk:mm')
    ) : (
      <SkeletonLoading width="100%" />
    );
  };

  const getWebLink = () => {
    return message ? (
      <a href={message.webLink} target="_blank" rel="noreferrer">
        Open in Outlook Web
      </a>
    ) : (
      <SkeletonLoading width="100%" />
    );
  };

  return (
    <div className="border border-gray-300 rounded">
      <div className="bg-gray-300 text-gray-700 p-2">Information</div>

      <ul className="bg-white border border-gray-200 text-gray-900">
        <li className="flex px-6 border-b border-gray-200 w-full">
          <div className="w-1/4 py-2 border-r border-gray-200">Subject</div>
          <div className="w-3/4 py-2 ml-4">
            {message ? message.subject : <SkeletonLoading width="100%" />}
          </div>
        </li>

        <li className="flex px-6 border-b border-gray-200 w-full">
          <div className="w-1/4 py-2 border-r border-gray-200">From</div>
          <div className="w-3/4 py-2 ml-4">{getSenderInfo()}</div>
        </li>

        <li className="flex px-6 border-b border-gray-200 w-full">
          <div className="w-1/4 py-2 border-r border-gray-200">To</div>
          <div className="w-3/4 py-2 ml-4">{getToRecipientsInfo()}</div>
        </li>

        <li className="flex px-6 border-b border-gray-200 w-full">
          <div className="w-1/4 py-2 border-r border-gray-200">Cc</div>
          <div className="w-3/4 py-2 ml-4">{getCcRecipientsInfo()}</div>
        </li>

        <li className="flex px-6 border-b border-gray-200 w-full">
          <div className="w-1/4 py-2 border-r border-gray-200">Received at</div>
          <div className="w-3/4 py-2 ml-4">{getReceivedDateTimeInfo()}</div>
        </li>

        <li className="flex px-6 w-full">
          <div className="w-1/4 py-2 border-r border-gray-200">Web Link</div>
          <div className="w-3/4 py-2 ml-4">{getWebLink()}</div>
        </li>
      </ul>
    </div>
  );
}
