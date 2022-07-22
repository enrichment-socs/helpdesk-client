import { CalendarIcon } from '@heroicons/react/outline';
import { addHours } from 'date-fns';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { TicketDueDate } from '../../../models/TicketDueDate';
import TicketDueDateChangeLogTable from './TicketDueDateChangeLogTable';
const DatePicker = dynamic(import('react-datepicker'), { ssr: false }) as any;

type Props = {
  ticketDueDates: TicketDueDate[];
};

export default function TicketDetailManageDueDate({ ticketDueDates }: Props) {
  const [reason, setReason] = useState('');

  let initialDueDate = new Date();
  initialDueDate = addHours(initialDueDate, 1);
  initialDueDate.setMinutes(0);
  initialDueDate.setSeconds(0);
  const [selectedDueDate, setSelectedDueDate] = useState(initialDueDate);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason) toast.error('Reason must be filled');
  };

  return (
    <div className="border border-gray-300 rounded p-4 mt-8">
      <div>
        <h2 className="font-semibold text-lg mb-2">
          Ticket Due Dates Change Log
        </h2>
        <TicketDueDateChangeLogTable ticketDueDates={ticketDueDates} />
      </div>

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
    </div>
  );
}
