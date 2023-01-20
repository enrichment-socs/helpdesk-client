import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import MultiLineSkeletonLoading from '../../../widgets/MultiLineSkeletonLoading';
import TicketDetailProperties from './TicketDetailProperties';
import TicketDetailConversation from './TicketDetailConversation';
import TicketDetailReply from './TicketDetailReply';
import { useRef } from 'react';
import { useAtom } from 'jotai';
import TicketDetailStore from '../../../stores/tickets/[id]';
import ResolutionConfirmationModal from './ResolutionConfirmationModal';
import InfoAlert from '../../../widgets/InfoAlert';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../../models/SessionUser';
import { ROLES } from '../../../shared/constants/roles';
import SuccessAlert from '../../../widgets/SuccessAlert';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { STATUS } from '../../../shared/constants/status';
import { Accordion } from '../../../widgets/Accordion';
import { TicketUtils } from '../../../shared/libs/ticket-utils';

const TicketDetailDetails = () => {
  const replyComponentRef = useRef(null);

  const [outlookMessages] = useAtom(TicketDetailStore.outlookMessages);
  const [attachmentsArrays] = useAtom(TicketDetailStore.attachmentsArray);
  const [ticket] = useAtom(TicketDetailStore.ticket);
  const [resolutions] = useAtom(TicketDetailStore.resolutions);
  const latestResolution =
    resolutions.length > 0 ? resolutions[resolutions.length - 1] : null;
  const isOldResolution = latestResolution
    ? latestResolution.messageId === null
    : false;

  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const renderBadge = (messageId: string) => {
    if (!messageId || !latestResolution) return '';
    if (latestResolution?.messageId !== messageId) return '';
    return <CheckCircleIcon className="w-4 h-4 ml-2 text-green-600" />;
  };

  return (
    <div>
      <ResolutionConfirmationModal />

      {isOldResolution &&
        (user?.roleName === ROLES.ADMIN ||
          user?.roleName === ROLES.SUPER_ADMIN) && (
          <InfoAlert
            className="mb-4"
            message={`Due to update in creating resolution mechanism, resolution for this message needs to be updated. Please mark a message in this ticket as resolution. You can do so by click <b>Mark as Resolution</b> button in one of the message below. <br/><br/> Previous resolution for this ticket was: ${latestResolution?.resolution}`}
          />
        )}

      {resolutions.length > 0 && ticket.status.statusName !== STATUS.CLOSED && (
        <InfoAlert
          className="mb-4"
          message={`This ticket has been resolved and a message has been marked as resolution. <b>Please close the ticket</b> as soon as possible if you are sure that there will be no follow ups.`}
        />
      )}

      {ticket.status.statusName === STATUS.CLOSED && (
        <SuccessAlert className="mb-4" message={`Ticket is already closed.`} />
      )}

      {ticket.status.statusName !== STATUS.CLOSED && (
        <InfoAlert
          className="mb-4"
          message={`You can update status of the ticket in the <b>Manage Ticket</b> tab above.`}
        />
      )}

      <div className="w-full rounded-2xl">
        <Accordion defaultOpen title="Conversations">
          {outlookMessages && outlookMessages.length > 0 ? (
            outlookMessages.map((message, idx) => {
              return (
                <TicketDetailConversation
                  key={message.id}
                  defaultOpen={idx === 0}
                  message={message}
                  attachments={attachmentsArrays[idx]}
                  canBeReplied
                  replyComponentRef={replyComponentRef}
                  renderBadge={renderBadge}
                  showAdminAction
                  useUniqueBody={idx !== 0}
                />
              );
            })
          ) : (
            <MultiLineSkeletonLoading width="100%" />
          )}
        </Accordion>

        {user?.roleName !== ROLES.USER &&
          TicketUtils.isEligibleToManage(user, ticket) && (
            <div ref={replyComponentRef}>
              <Accordion defaultOpen title="Reply">
                <TicketDetailReply />
              </Accordion>
            </div>
          )}

        <Accordion title="More Properties">
          <TicketDetailProperties
            ticket={ticket}
            outlookMessage={outlookMessages ? outlookMessages[0] : null}
            resolution={latestResolution}
          />
        </Accordion>
      </div>
    </div>
  );
};

export default TicketDetailDetails;
