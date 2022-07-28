import { CalendarIcon } from '@heroicons/react/outline';
import { addHours } from 'date-fns';
import { SetStateAction } from 'jotai';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Dispatch, useState } from 'react';
import toast from 'react-hot-toast';
import { CreateTicketDueDateDto } from '../../../models/dto/ticket-due-dates/create-ticket-due-date.dto';
import { SessionUser } from '../../../models/SessionUser';
import { Ticket } from '../../../models/Ticket';
import { TicketDueDate } from '../../../models/TicketDueDate';
import { TicketDueDateService } from '../../../services/TicketDueDateService';
import { ROLES } from '../../../shared/constants/roles';
import { ClientPromiseWrapper } from '../../../shared/libs/client-promise-wrapper';
import { confirm } from '../../../shared/libs/confirm-dialog-helper';
import { TicketUtils } from '../../../shared/libs/ticket-utils';
import TicketDueDateChangeLogTable from './TicketDueDateChangeLogTable';
const DatePicker = dynamic(import('react-datepicker'), { ssr: false }) as any;

type Props = {
  ticketDueDates: TicketDueDate[];
  setTicketDueDates: Dispatch<SetStateAction<TicketDueDate[]>>;
  ticket: Ticket;
};

export default function TicketDetailManageDueDate({
  ticketDueDates,
  ticket,
  setTicketDueDates,
}: Props) {
  const session = useSession();
  const user = session.data.user as SessionUser;
  const ticketDueDateService = new TicketDueDateService(user?.accessToken);

  let initialDueDate = new Date(ticket.dueBy);
  initialDueDate = addHours(initialDueDate, 1);
  initialDueDate.setMinutes(0);
  initialDueDate.setSeconds(0);
  const [selectedDueDate, setSelectedDueDate] = useState(initialDueDate);
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();

    if (selectedDueDate.getTime() < now.getTime()) {
      toast.error('Due date cant be in the past');
      return;
    } else if (!reason) {
      toast.error('Reason must be filled');
      return;
    }

    const message = 'Are you sure you want to change the due date ?';
    if (await confirm(message)) {
      const dto: CreateTicketDueDateDto = {
        dueDate: selectedDueDate,
        reason,
        ticketId: ticket.id,
      };
      toast.promise(ticketDueDateService.add(dto), {
        success: (newDueDate) => {
          setTicketDueDates([...ticketDueDates, newDueDate]);
          return 'Due date succesfully updated';
        },
        loading: 'Updating due date...',
        error: (e) => e.toString(),
      });
    }
  };

  return (
    <div className="border border-gray-300 rounded p-4 mt-8 shadow-sm">
      <div>
        <h2 className="font-semibold text-lg mb-2">
          Ticket Due Dates Change Log
        </h2>
        <TicketDueDateChangeLogTable ticketDueDates={ticketDueDates} />
      </div>

      {TicketUtils.isEligibleToManage(user, ticket) && (
        <form onSubmit={handleSubmit}>
          <h2 className="font-semibold text-lg mb-2 mt-8">Manage Due Date</h2>

          <div className="mt-3">
            <label>New due date: </label>
            <DatePicker
              selected={selectedDueDate}
              showTimeSelect
              dateFormat="Pp"
              onChange={setSelectedDueDate}
              className={`${'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
            />
          </div>

          <div className="mt-3">
            <label>Reason to change due date: </label>
            <input
              type="text"
              className="border border-gray-300 rounded p-2 w-full outline-none"
              onChange={(e) => setReason(e.target.value)}
              value={reason}
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Update <CalendarIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
