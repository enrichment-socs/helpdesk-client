import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Case as SwitchCase, Else, If, Switch, Then } from 'react-if';
import { Ticket } from '../../../models/Ticket';
import { TicketStatus } from '../../../models/TicketStatus';
import { CreateTicketStatusDto } from '../../../models/dto/ticket-statuses/create-ticket-status.dto';
import { TicketResolution } from '../../../models/TicketResolution';
import { SessionUser } from '../../../models/SessionUser';
import { Status } from '../../../models/Status';
import { TicketStatusService } from '../../../services/TicketStatusService';
import { STATUS } from '../../../shared/constants/status';
import { ClientPromiseWrapper } from '../../../shared/libs/client-promise-wrapper';
import { confirm } from '../../../shared/libs/confirm-dialog-helper';
import InfoAlert from '../../../widgets/InfoAlert';
import SuccessAlert from '../../../widgets/SuccessAlert';
import TicketStatusChangeLogTable from './TicketStatusChangeLogTable';
import { TicketService } from '../../../services/TicketService';
import { useRouter } from 'next/router';

type Props = {
  ticketStatuses: TicketStatus[];
  resolution: TicketResolution;
  statuses: Status[];
  ticket: Ticket;
  setTicketStatuses: Dispatch<SetStateAction<TicketStatus[]>>;
};

export default function TicketDetailManage({
  ticketStatuses,
  resolution,
  statuses,
  ticket,
  setTicketStatuses,
}: Props) {
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const router = useRouter();
  const ticketService = new TicketService(user?.accessToken);
  const ticketStatusService = new TicketStatusService(user?.accessToken);
  const [enableDeleteButton, setEnableDeleteButton] = useState(true);

  const [reason, setReason] = useState('');

  useEffect(() => {
    if (getCurrentStatus() === STATUS.CLOSED) {
      setEnableDeleteButton(false);
    }
  }, []);

  const getCurrentStatus = () => {
    if (ticketStatuses.length == 0) return 'No Status';
    return ticketStatuses[ticketStatuses.length - 1].status.statusName;
  };

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
      <div>
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

      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-2">Ticket Status Change Log</h2>
        <TicketStatusChangeLogTable ticketStatuses={ticketStatuses} />
      </div>

      <If condition={user?.id === ticket.assignedTo.id}>
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
              <SwitchCase condition={getCurrentStatus() === STATUS.ASSIGNED}>
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
              </SwitchCase>

              <SwitchCase condition={getCurrentStatus() === STATUS.IN_PROGRESS}>
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
              </SwitchCase>

              <SwitchCase condition={getCurrentStatus() === STATUS.PENDING}>
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
              </SwitchCase>

              <SwitchCase condition={getCurrentStatus() === STATUS.RESOLVED}>
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
              </SwitchCase>
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

      {getCurrentStatus() === STATUS.CLOSED && (
        <SuccessAlert
          className="mt-4"
          message={`Ticket is closed, view the resolution in <b>Resolution</b> tab`}
        />
      )}
    </section>
  );
}
