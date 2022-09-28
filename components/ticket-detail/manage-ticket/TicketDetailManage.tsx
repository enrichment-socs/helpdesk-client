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

export default function TicketDetailManage() {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const [resolution] = useAtom(TicketDetailStore.resolution);
  const [ticketStatuses, setTicketStatuses] = useAtom(
    TicketDetailStore.ticketStatuses
  );
  const [ticketDueDates, setTicketDueDates] = useAtom(
    TicketDetailStore.ticketDueDates
  );
  const [statuses] = useAtom(TicketDetailStore.statuses);
  const [ticket] = useAtom(TicketDetailStore.ticket);

  return (
    <section className="text-gray-800">
      {!TicketUtils.isEligibleToManage(user, ticket) && (
        <InfoAlert
          message="Ticket could only be managed by the ticket handler"
          className="mb-4"
        />
      )}

      <TicketDetailManageStatus/>

      <TicketDetailManageDueDate/>

      {TicketUtils.isEligibleToManage(user, ticket) && (
        <TicketDetailManageAction/>
      )}

      {TicketUtils.getCurrentStatus(ticketStatuses) === STATUS.CLOSED && (
        <SuccessAlert
          className="mt-4"
          message={`Ticket is closed, view the resolution in <b>Resolution</b> tab`}
        />
      )}
    </section>
  );
}
