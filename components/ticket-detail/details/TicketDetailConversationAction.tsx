import { CheckCircleIcon, CheckIcon, ReplyIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { MutableRefObject } from 'react';
import toast from 'react-hot-toast';
import { replyRecipientsAtom } from '../../../atom';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { STATUS } from '../../../shared/constants/status';
import TicketDetailStore from '../../../stores/tickets/[id]';
import { TicketUtils } from '../../../shared/libs/ticket-utils';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../../models/SessionUser';

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
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const [ticket] = useAtom(TicketDetailStore.ticket);
  const [ticketStatuses] = useAtom(TicketDetailStore.ticketStatuses);
  const [, setReplyRecipients] = useAtom(replyRecipientsAtom);
  const [resolutions] = useAtom(TicketDetailStore.resolutions);
  const [, setMessageId] = useAtom(TicketDetailStore.selectedOutlookMessageId);
  const [, setConversationId] = useAtom(
    TicketDetailStore.selectedConversationId
  );
  const [, setOpenModal] = useAtom(
    TicketDetailStore.openConfirmResolutionModal
  );

  const onReply = () => {
    const latestStatus = ticketStatuses[ticketStatuses.length - 1];
    if (latestStatus.status.statusName === STATUS.ASSIGNED) {
      toast.error(() => (
        <span>
          Ticket status should be at least <strong>In Progress</strong> before
          you can reply
        </span>
      ));
      return;
    }

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
    if (
      resolutions.length > 0 &&
      resolutions[resolutions.length - 1].messageId === message.id
    ) {
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

  if (TicketUtils.isEligibleToManage(user, ticket)) {
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
  }

  return <></>;
};

export default TicketDetailConversationAction;
