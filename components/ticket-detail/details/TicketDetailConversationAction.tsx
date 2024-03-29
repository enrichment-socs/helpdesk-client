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
import clsx from 'clsx';

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
  const [, setCurrentTab] = useAtom(TicketDetailStore.currentTab);

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

  const isMarkedAsResolution =
    resolutions.length > 0 &&
    resolutions[resolutions.length - 1].messageId === message.id;

  const disabled = ticket.status.statusName === STATUS.ASSIGNED;

  const renderResolutionBtn = () => {
    if (isMarkedAsResolution) {
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
          disabled={disabled}
          className={clsx(
            { 'bg-green-600 hover:bg-green-700': !disabled },
            { 'bg-gray-300': disabled },
            'shadow flex items-center text-white rounded px-3 py-1'
          )}>
          Mark as Resolution <CheckIcon className="w-4 h-4 ml-2" />
        </button>
      );
    }
  };

  if (TicketUtils.isEligibleToManage(user, ticket)) {
    return (
      <div className="mt-4">
        <div className="flex justify-end">
          {renderResolutionBtn()}

          {canBeReplied && (
            <button
              onClick={onReply}
              disabled={disabled}
              className={clsx(
                { 'bg-primary hover:bg-primary-dark': !disabled },
                { 'bg-gray-300': disabled },
                'ml-3 shadow flex items-center text-white rounded px-3 py-1'
              )}>
              Reply <ReplyIcon className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
        {isMarkedAsResolution && ticket.status.statusName !== STATUS.CLOSED && (
          <div className="text-xs text-blue-400 font-medium text-right mt-2">
            *You have marked this message as resolution. If you are sure that
            there will be no follow ups, you can close this ticket in the{' '}
            <b>Manage Ticket</b> tab or click{' '}
            <button
              className="text-blue-500 underline"
              onClick={() => setCurrentTab('Manage Ticket')}>
              here
            </button>
          </div>
        )}
      </div>
    );
  }

  return <></>;
};

export default TicketDetailConversationAction;
