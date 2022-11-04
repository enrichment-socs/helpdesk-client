import { CheckIcon, ReplyIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { MutableRefObject } from 'react';
import { replyRecipientsAtom } from '../../../atom';
import { OutlookMessage } from '../../../models/OutlookMessage';
import TicketDetailStore from '../../../stores/tickets/[id]';

type Props = {
  message: OutlookMessage;
  canBeReplied?: boolean;
  canBeMarkedAsResolution?: boolean;
  replyComponentRef?: MutableRefObject<HTMLFormElement>;
};

const TicketDetailConversationAction = ({
  canBeReplied,
  canBeMarkedAsResolution,
  message,
  replyComponentRef,
}: Props) => {
  const [, setReplyRecipients] = useAtom(replyRecipientsAtom);
  const [resolution] = useAtom(TicketDetailStore.resolution);
  console.log({ resolution });
  const [, setMessageId] = useAtom(TicketDetailStore.selectedOutlookMessageId);
  const [, setOpenModal] = useAtom(
    TicketDetailStore.openConfirmResolutionModal
  );

  const onReply = () => {
    const toRecipients = message.from.emailAddress.address;
    const ccRecipients = message.ccRecipients
      .map((recipient) => recipient.emailAddress.address)
      .join(';');

    setReplyRecipients({
      subject: `Re: ${message.subject}`,
      toRecipients,
      ccRecipients,
      messageId: message.id,
    });

    if (replyComponentRef) {
      replyComponentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onMarkAsResolution = () => {
    if (!resolution) {
      setMessageId(message.id);
      setOpenModal(true);
    } else {
      console.log('To be implemented');
    }
  };

  return (
    <div className="flex justify-end">
      {canBeMarkedAsResolution && (
        <button
          onClick={onMarkAsResolution}
          className="shadow flex items-center bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1">
          Mark as Resolution <CheckIcon className="w-4 h-4 ml-2" />
        </button>
      )}

      {canBeReplied && (
        <button
          onClick={onReply}
          className="ml-3 shadow flex items-center bg-primary hover:bg-primary-dark text-white rounded px-3 py-1">
          Reply <ReplyIcon className="w-4 h-4 ml-2" />
        </button>
      )}
    </div>
  );
};

export default TicketDetailConversationAction;
