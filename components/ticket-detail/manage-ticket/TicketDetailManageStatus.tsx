import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { Else, If, Switch, Then, Case } from 'react-if';
import { CreateTicketStatusDto } from '../../../models/dto/ticket-statuses/create-ticket-status.dto';
import { SessionUser } from '../../../models/SessionUser';
import { Status } from '../../../models/Status';
import { Ticket } from '../../../models/Ticket';
import { TicketResolution } from '../../../models/TicketResolution';
import { TicketStatus } from '../../../models/TicketStatus';
import { TicketService } from '../../../services/TicketService';
import { TicketStatusService } from '../../../services/TicketStatusService';
import { ROLES } from '../../../shared/constants/roles';
import { STATUS } from '../../../shared/constants/status';
import { ClientPromiseWrapper } from '../../../shared/libs/client-promise-wrapper';
import InfoAlert from '../../../widgets/InfoAlert';
import TicketStatusChangeLogTable from './TicketStatusChangeLogTable';
import { confirm } from '../../../shared/libs/confirm-dialog-helper';

type Props = {
  resolution: TicketResolution;
  ticketStatuses: TicketStatus[];
  setTicketStatuses: Dispatch<SetStateAction<TicketStatus[]>>;
  statuses: Status[];
  ticket: Ticket;
  getCurrentStatus: () => string;
};

export default function TicketDetailManageStatus({
  resolution,
  ticketStatuses,
  setTicketStatuses,
  statuses,
  ticket,
  getCurrentStatus,
}: Props) {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const [reason, setReason] = useState('');
  const ticketService = new TicketService(user?.accessToken);
  const ticketStatusService = new TicketStatusService(user?.accessToken);

  const renderReasonInputText = () => {
    return (
      <div className="mt-3">
        <label>Reason to change status: </label>
        <input
          type="text"
          className="border border-gray-300 rounded p-2 w-full outline-none"
          onChange={(e) => setReason(e.target.value)}
          value={reason}
        />
      </div>
    );
  };

  const updateStatus = async (
    statusName: string,
    shouldFillReason: boolean
  ) => {
    const status = statuses.find((s) => s.statusName === statusName);
    if (!status) {
      toast.error('Specified status does not exist, please contact developer');
      return;
    }

    if (shouldFillReason && !reason) {
      toast.error('Reason must be filled');
      return;
    }

    const message = `Are you sure you want to change the status from <b>${getCurrentStatus()}</b> to <b>${statusName}</b> ${
      shouldFillReason ? `with reason: <b>${reason}</b>` : ''
    } ?`;
    if (await confirm(message)) {
      toast('Updating status...');

      const dto: CreateTicketStatusDto = {
        ticketId: ticket.id,
        reason: reason || null,
        statusId: status.id,
        userId: user.id,
      };

      const wrapper = new ClientPromiseWrapper(toast);
      const addedStatus = await wrapper.handle(ticketStatusService.add(dto));

      setTicketStatuses([...ticketStatuses, addedStatus]);
      setReason('');
      toast.dismiss();
      toast.success('Status updated succesfully');
    }
  };

  return (
    <div className="border border-gray-300 rounded p-4">
      <div>
        <h2 className="font-semibold text-lg mb-2">Ticket Status Change Log</h2>
        <TicketStatusChangeLogTable ticketStatuses={ticketStatuses} />
      </div>

      <If
        condition={
          user?.id === ticket.assignedTo.id ||
          user?.roleName === ROLES.SUPER_ADMIN
        }>
        <Then>
          <div className="mt-8">
            <h2 className="font-semibold text-lg mb-2">Manage Ticket Status</h2>
            <div>
              Current Status:{' '}
              <input
                className="border border-gray-300 rounded p-2 w-full"
                type="text"
                disabled
                value={getCurrentStatus()}
              />
            </div>

            <Switch>
              <Case condition={getCurrentStatus() === STATUS.ASSIGNED}>
                <div className="flex space-x-4 justify-end mt-3">
                  <button
                    onClick={() => updateStatus(STATUS.IN_PROGRESS, false)}
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="hidden md:block">Change Status to </span>
                    <span className="font-bold ml-1">{STATUS.IN_PROGRESS}</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </Case>

              <Case condition={getCurrentStatus() === STATUS.IN_PROGRESS}>
                <div>
                  {renderReasonInputText()}

                  <div className="flex space-x-4 justify-end mt-3">
                    <button
                      onClick={() => updateStatus(STATUS.PENDING, true)}
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-gray-800 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600">
                      <span className="hidden md:block">Change Status to </span>
                      <span className="font-bold ml-1">{STATUS.PENDING}</span>
                    </button>

                    <button
                      onClick={() => updateStatus(STATUS.RESOLVED, true)}
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600">
                      <span className="hidden md:block">Change Status to </span>
                      <span className="font-bold ml-1">{STATUS.RESOLVED}</span>
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Case>

              <Case condition={getCurrentStatus() === STATUS.PENDING}>
                {renderReasonInputText()}

                <div className="flex space-x-4 justify-end mt-3">
                  <button
                    onClick={() => updateStatus(STATUS.IN_PROGRESS, true)}
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="hidden md:block">Change Status to </span>
                    <span className="font-bold ml-1">{STATUS.IN_PROGRESS}</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </Case>

              <Case condition={getCurrentStatus() === STATUS.RESOLVED}>
                <div>
                  {renderReasonInputText()}
                  {!resolution && (
                    <small className="text-red-400 font-medium">
                      *You must create a resolution before closing this ticket.
                    </small>
                  )}

                  <div className="flex space-x-4 justify-between mt-3">
                    <button
                      onClick={() => updateStatus(STATUS.IN_PROGRESS, true)}
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <ChevronLeftIcon className="h-5 w-5" />
                      <span className="hidden md:block">Change Status to </span>
                      <span className="font-bold ml-1">
                        {STATUS.IN_PROGRESS}
                      </span>
                    </button>

                    <button
                      onClick={() => updateStatus(STATUS.CLOSED, true)}
                      type="button"
                      disabled={!resolution}
                      className={`${
                        resolution
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-400'
                      } inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white focus:outline-none`}>
                      <span className="hidden md:block">Change Status to </span>
                      <span className="font-bold ml-1">
                        {STATUS.CLOSED}
                      </span>{' '}
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Case>
            </Switch>
          </div>
        </Then>
        <Else>
          <InfoAlert
            message="Ticket could only be managed by the ticket handler"
            className="mt-4"
          />
        </Else>
      </If>
    </div>
  );
}
