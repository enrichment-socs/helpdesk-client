import { CheckCircleIcon, CheckIcon, ReplyIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { MutableRefObject } from 'react';
import { replyRecipientsAtom } from '../../../atom';
import { OutlookMessage } from '../../../models/OutlookMessage';
import TicketDetailStore from '../../../stores/tickets/[id]';

type Props = {
  message: OutlookMessage;
  canBeReplied?: boolean;
  replyComponentRef?: MutableRefObject<HTMLFormElement>;
};

const TicketDetailConversationAction = ({
  canBeReplied,
  message,
  replyComponentRef,
}: Props) => {
  const [, setReplyRecipients] = useAtom(replyRecipientsAtom);
  const [resolution] = useAtom(TicketDetailStore.resolution);
  console.log({ resolution });
  const [, setMessageId] = useAtom(TicketDetailStore.selectedOutlookMessageId);
  const [, setConversationId] = useAtom(
    TicketDetailStore.selectedConversationId
  );
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
    setConversationId(message.conversationId);
    setMessageId(message.id);
    setOpenModal(true);
  };

  const renderResolutionBtn = () => {
    if (resolution && resolution.messageId === message.id) {
      return (
        <button
          disabled
          className="flex items-center bg-gray-300 text-white rounded px-3 py-1">
          Marked as Resolution <CheckCircleIcon className="w-4 h-4 ml-2" />
        </button>
      );
    } else {
      return (
        <button
          onClick={onMarkAsResolution}
          className="shadow flex items-center bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1">
          Mark as Resolution <CheckIcon className="w-4 h-4 ml-2" />
        </button>
      );
    }
  };

  return (
    <div className="flex justify-end">
      {renderResolutionBtn()}

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