import { ChartBarIcon } from '@heroicons/react/solid';
import { TicketSummary } from '../../../models/TicketSummary';
import { COLORS } from '../../../shared/constants/color';

type Props = {
  ticketSummary: TicketSummary;
};

const AdminTicketSummaryContainer = ({ ticketSummary }: Props) => {
  const ticketCategories = [
    {
      name: 'Assigned',
      count: ticketSummary.assignedCount,
      color: COLORS.ASSIGNED_TEXT_COLOR,
    },
    {
      name: 'Pending',
      count: ticketSummary.pendingCount,
      color: COLORS.PENDING_TEXT_COLOR,
    },
    {
      name: 'In Progress',
      count: ticketSummary.inProgressCount,
      color: COLORS.INPROGRESS_TEXT_COLOR,
    },
    {
      name: 'Resolved',
      count: ticketSummary.resolvedCount,
      color: COLORS.RESOLVED_TEXT_COLOR,
    },
    {
      name: 'Closed',
      count: ticketSummary.closedCount,
      color: COLORS.CLOSED_TEXT_COLOR,
    },
  ];

  return (
    <div className="mx-2 p-2 border-2 md:w-1/4 rounded divide-y">
      <div className="text-lg font-bold mb-3 flex items-center">
        <ChartBarIcon className="h-5 w-5" />
        <span className="ml-3">My Ticket Summary</span>
      </div>

      {ticketCategories.map((category, idx) => {
        return (
          <div key={idx} className="p-3">
            <div className="font-semibold">{category.name}</div>
            <div className="text-slate-600 text-4xl" style={{color: category.color}}>{category.count}</div>
          </div>
        );
      })}

      {/* <div className="p-3">
        <div className="font-semibold">Pending</div>
        <div className="text-slate-600 text-4xl">0</div>
      </div>

      <div className="p-3">
        <div className="font-semibold">Awaiting Approval</div>
        <div className="text-slate-600 text-4xl">0</div>
      </div>

      <div className="p-3">
        <div className="font-semibold">Awaiting Updates</div>
        <div className="text-slate-600 text-4xl">0</div>
      </div> */}
    </div>
  );
};

export default AdminTicketSummaryContainer;
