import { OutlookMessage } from '../../../models/OutlookMessage';
import SkeletonLoading from '../../../widgets/SkeletonLoading';

type Props = {
  message: OutlookMessage;
};

const CaseDetailConversationHeader = ({ message }: Props) => {
  const getSubjectInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;
    return message.subject || 'No Subject';
  };

  const getToRecipientsInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;

    const recipients = message.toRecipients
      .map((recipient, idx) => recipient.emailAddress.address)
      .join(', ');

    return recipients || '-';
  };

  const getCcRecipientsInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;

    const recipients = message.ccRecipients
      .map((recipient, idx) => recipient.emailAddress.address)
      .join(', ');

    return recipients || '-';
  };

  return (
    <div className="pb-2">
      <div>
        <span className="font-bold">To:</span>
        <span className="ml-3">{getToRecipientsInfo()}</span>
      </div>
      <div>
        <span className="font-bold">Subject:</span>
        <span className="ml-3">{getSubjectInfo()}</span>
      </div>
      <div>
        <span className="font-bold">Cc:</span>
        <span className="ml-3">{getCcRecipientsInfo()}</span>
      </div>
    </div>
  );
};

export default CaseDetailConversationHeader;
