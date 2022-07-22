import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Ticket } from '../../../models/Ticket';
import { TicketStatus } from '../../../models/TicketStatus';
import { TicketResolution } from '../../../models/TicketResolution';
import { SessionUser } from '../../../models/SessionUser';
import { Status } from '../../../models/Status';
import { STATUS } from '../../../shared/constants/status';
import { confirm } from '../../../shared/libs/confirm-dialog-helper';
import SuccessAlert from '../../../widgets/SuccessAlert';
import { TicketService } from '../../../services/TicketService';
import { useRouter } from 'next/router';
import { TicketDueDate } from '../../../models/TicketDueDate';
import TicketDetailManageStatus from './TicketDetailManageStatus';
import TicketDetailManageDueDate from './TicketDetailManageDueDate';

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
  console.log({ ticketDueDates });
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const router = useRouter();
  const ticketService = new TicketService(user?.accessToken);
  const [enableDeleteButton, setEnableDeleteButton] = useState(true);

  useEffect(() => {
    if (getCurrentStatus() === STATUS.CLOSED) {
      setEnableDeleteButton(false);
    }
  }, []);

  const getCurrentStatus = () => {
    if (ticketStatuses.length == 0) return 'No Status';
    return ticketStatuses[ticketStatuses.length - 1].status.statusName;
  };

  const handleDeleteTicket = async () => {
    const message =
      'Are you sure you want to delete this ticket? there is no going back after you do this.';
    if (await confirm(message)) {
      toast.promise(ticketService.deleteById(ticket.id), {
        loading: 'Deleting ticket...',
        success: (_) => {
          router.push('/tickets');
          return 'Ticket deleted succesfully!';
        },
        error: (e) => e.toString(),
      });
    }
  };

  return (
    <section className="text-gray-800">
      <TicketDetailManageStatus
        ticket={ticket}
        statuses={statuses}
        resolution={resolution}
        ticketStatuses={ticketStatuses}
        setTicketStatuses={setTicketStatuses}
        getCurrentStatus={getCurrentStatus}
      />

      <TicketDetailManageDueDate
        ticketDueDates={ticketDueDates}
        setTicketDueDates={setTicketDueDates}
        ticket={ticket}
      />

      <div className="mt-8 border border-gray-300 rounded p-4 shadow-sm">
        <h2 className="font-semibold text-lg mb-2">Action</h2>
        <div className=" p-4 border border-red-300 rounded bg-red-50 flex flex-col md:flex-row justify-between">
          <div className="text-sm">
            <h3 className="font-medium">Delete this ticket.</h3>
            <p>
              Once you delete this ticket, there is no going back. Please be
              certain. Ticket cant be deleted if it&rsquo;s already closed
            </p>
          </div>

          <div>
            <button
              disabled={!enableDeleteButton}
              onClick={handleDeleteTicket}
              type="button"
              className={`${
                enableDeleteButton
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white'
                  : 'bg-gray-400 text-gray-100'
              } w-full justify-center text-center mt-2 md:mt-0 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}>
              Delete Ticket
            </button>
          </div>
        </div>
      </div>

      {getCurrentStatus() === STATUS.CLOSED && (
        <SuccessAlert
          className="mt-4"
          message={`Ticket is closed, view the resolution in <b>Resolution</b> tab`}
        />
      )}
    </section>
  );
}
