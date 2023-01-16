import { format, intervalToDuration } from 'date-fns';
import { Ticket } from '../../../models/Ticket';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { TicketResolution } from '../../../models/TicketResolution';
import SkeletonLoading from '../../../widgets/SkeletonLoading';
import TicketDetailStore from '../../../stores/tickets/[id]';
import { useAtom } from 'jotai';
import { STATUS } from '../../../shared/constants/status';

type Props = {
  outlookMessage: OutlookMessage | null;
  ticket: Ticket;
  resolution: TicketResolution;
};

const TicketDetailProperties = ({
  outlookMessage,
  ticket,
  resolution,
}: Props) => {
  const isFetching = () => outlookMessage === null;
  const [ticketStatuses] = useAtom(TicketDetailStore.ticketStatuses);
  console.log({ ticketStatuses });

  const getCategory = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      ticket.category.categoryName
    );
  };

  const getPriority = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      ticket.priority.priorityName
    );
  };

  const getStatus = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      ticket.status.statusName
    );
  };

  const getAssignedTo = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      ticket.assignedTo.name
    );
  };

  const getDueBy = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      format(new Date(ticket.dueBy), 'dd MMM yyyy, kk:mm')
    );
  };

  const getResolvedDate = () => {
    if (isFetching()) return <SkeletonLoading width="100%" />;
    const resolvedStatus = ticketStatuses.find(
      (s) => s.status.statusName === STATUS.RESOLVED
    );
    if (!resolvedStatus)
      return <span className="text-gray-400">Not resolved yet</span>;
    return format(new Date(resolvedStatus.created_at), 'dd MMM yyyy, kk:mm');
  };

  const getClosedDate = () => {
    if (isFetching()) return <SkeletonLoading width="100%" />;
    const closedStatus = ticketStatuses.find(
      (s) => s.status.statusName === STATUS.CLOSED
    );
    if (!closedStatus)
      return <span className="text-gray-400">Not resolved yet</span>;
    return format(new Date(closedStatus.created_at), 'dd MMM yyyy, kk:mm');
  };

  return (
    <div className="divide-y">
      <div className="font-bold text-sm pb-2">Properties</div>
      <div className="pt-5">
        <table className="border w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Category</td>
              <td className="px-6 py-3 break-all">{getCategory()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Priority</td>
              <td className="px-6 py-3 break-all">{getPriority()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Status</td>
              <td className="px-6 py-3 break-all">{getStatus()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Assigned To</td>
              <td className="px-6 py-3 break-all">{getAssignedTo()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Due By</td>
              <td className="px-6 py-3 break-all">{getDueBy()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Resolved Date</td>
              <td className="px-6 py-3 break-all">{getResolvedDate()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Closed Date</td>
              <td className="px-6 py-3 break-all">{getClosedDate()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketDetailProperties;
