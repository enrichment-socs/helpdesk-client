import { CalendarIcon } from '@heroicons/react/outline';
import { addHours } from 'date-fns';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CreateTicketDueDateDto } from '../../../models/dto/ticket-due-dates/create-ticket-due-date.dto';
import { SessionUser } from '../../../models/SessionUser';
import { TicketDueDateService } from '../../../services/TicketDueDateService';
import { STATUS } from '../../../shared/constants/status';
import { confirm } from '../../../shared/libs/confirm-dialog-helper';
import { TicketUtils } from '../../../shared/libs/ticket-utils';
import TicketDetailStore from '../../../stores/tickets/[id]';
import TicketDueDateChangeLogTable from './TicketDueDateChangeLogTable';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
const DatePicker = dynamic(import('react-datepicker'), { ssr: false }) as any;

export default function TicketDetailManageDueDate() {
  const [ticket] = useAtom(TicketDetailStore.ticket);
  const [ticketStatuses] = useAtom(TicketDetailStore.ticketStatuses);
  const [ticketDueDates, setTicketDueDates] = useAtom(
    TicketDetailStore.ticketDueDates
  );

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
    <Disclosure as="div" className="mt-6">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`${
              open ? 'rounded-t' : 'rounded'
            } flex justify-between w-full px-4 py-2 text-sm border border-gray-300 font-medium text-left text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}>
            <span className="font-bold">Manage Ticket Status</span>
            <ChevronUpIcon
              className={`${
                open ? 'transform rotate-180' : ''
              } w-5 h-5 text-gray-500`}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-300 ease-in-out"
            enterFrom="transform scale-50 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-300 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-50 opacity-0">
            <Disclosure.Panel className="p-4 border-r border-l border-b border-gray-300 text-sm text-gray-800">
              <TicketDueDateChangeLogTable ticketDueDates={ticketDueDates} />

              {TicketUtils.isEligibleToManage(user, ticket) &&
                TicketUtils.getCurrentStatus(ticketStatuses) !==
                  STATUS.CLOSED && (
                  <form onSubmit={handleSubmit}>
                    <h2 className="font-semibold text-lg mb-2 mt-8">
                      Manage Due Date
                    </h2>

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
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
