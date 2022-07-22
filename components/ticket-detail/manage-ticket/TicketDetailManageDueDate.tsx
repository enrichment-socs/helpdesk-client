import { TicketDueDate } from '../../../models/TicketDueDate';
import TicketDueDateChangeLogTable from './TicketDueDateChangeLogTable';

type Props = {
  ticketDueDates: TicketDueDate[];
};

export default function TicketDetailManageDueDate({ ticketDueDates }: Props) {
  return (
    <div className="border border-gray-300 rounded p-4 mt-8">
      <div>
        <h2 className="font-semibold text-lg mb-2">
          Ticket Due Dates Change Log
        </h2>
        <TicketDueDateChangeLogTable ticketDueDates={ticketDueDates} />
      </div>
    </div>
  );
}
