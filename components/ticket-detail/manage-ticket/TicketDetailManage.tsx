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

type Props = {
  statuses: Status[];
  ticket: Ticket;
  resolution: TicketResolution;
  ticketStatuses: TicketStatus[];
  setTicketStatuses: Dispatch<SetStateAction<TicketStatus[]>>;
  ticketDueDates: TicketDueDate[];
  setTicketDueDates: Dispatch<SetStateAction<TicketDueDate[]>>;
};

export default function TicketDetailManage({
  ticketStatuses,
  resolution,
  statuses,
  ticket,
  setTicketStatuses,
  ticketDueDates,
  setTicketDueDates,
}: Props) {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  return (
    <section className="text-gray-800">
      {!TicketUtils.isEligibleToManage(user, ticket) && (
        <InfoAlert
          message="Ticket could only be managed by the ticket handler"
          className="mb-4"
        />
      )}

      <TicketDetailManageStatus
        ticket={ticket}
        statuses={statuses}
        resolution={resolution}
        ticketStatuses={ticketStatuses}
        setTicketStatuses={setTicketStatuses}
        setTicketDueDates={setTicketDueDates}
      />

      <TicketDetailManageDueDate
        ticketDueDates={ticketDueDates}
        setTicketDueDates={setTicketDueDates}
        ticket={ticket}
        ticketStatuses={ticketStatuses}
      />

      {TicketUtils.isEligibleToManage(user, ticket) && (
        <TicketDetailManageAction
          ticket={ticket}
          ticketStatuses={ticketStatuses}
        />
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
