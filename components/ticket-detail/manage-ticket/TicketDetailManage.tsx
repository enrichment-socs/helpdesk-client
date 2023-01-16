import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import { Ticket } from '../../../models/Ticket';
import { TicketStatus } from '../../../models/TicketStatus';
import { TicketResolution } from '../../../models/TicketResolution';
import { SessionUser } from '../../../models/SessionUser';
import { Status } from '../../../models/Status';
import { STATUS } from '../../../shared/constants/status';
import SuccessAlert from '../../../widgets/SuccessAlert';
import { TicketDueDate } from '../../../models/TicketDueDate';
import TicketDetailManageStatus from './TicketDetailManageStatus';
import TicketDetailManageDueDate from './TicketDetailManageDueDate';
import InfoAlert from '../../../widgets/InfoAlert';
import { TicketUtils } from '../../../shared/libs/ticket-utils';
import TicketDetailManageAction from './TicketDetailManageAction';
import { useAtom } from 'jotai';
import TicketDetailStore from '../../../stores/tickets/[id]';
import TicketResolutionChangeLogTable from './TicketResolutionChangeLogTable';

export default function TicketDetailManage() {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const [ticketStatuses] = useAtom(TicketDetailStore.ticketStatuses);
  const [ticket] = useAtom(TicketDetailStore.ticket);

  return (
    <section className="text-gray-800">
      {!TicketUtils.isEligibleToManage(user, ticket) && (
        <InfoAlert
          message="Ticket could only be managed by the ticket handler"
          className="mb-4"
        />
      )}

      {TicketUtils.getCurrentStatus(ticketStatuses) === STATUS.CLOSED && (
        <SuccessAlert
          className="mt-2 mb-4"
          message={`Ticket is already closed`}
        />
      )}

      <TicketDetailManageStatus />

      <TicketDetailManageDueDate />

      <TicketResolutionChangeLogTable />

      {TicketUtils.isEligibleToManage(user, ticket) && (
        <TicketDetailManageAction />
      )}
    </section>
  );
}
