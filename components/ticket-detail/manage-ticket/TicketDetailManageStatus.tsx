import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { If, Switch, Then, Case } from 'react-if';
import { CreateTicketStatusDto } from '../../../models/dto/ticket-statuses/create-ticket-status.dto';
import { SessionUser } from '../../../models/SessionUser';
import { TicketStatusService } from '../../../services/TicketStatusService';
import { STATUS } from '../../../shared/constants/status';
import { ClientPromiseWrapper } from '../../../shared/libs/client-promise-wrapper';
import TicketStatusChangeLogTable from './TicketStatusChangeLogTable';
import { confirm } from '../../../shared/libs/confirm-dialog-helper';
import { TicketDueDateService } from '../../../services/TicketDueDateService';
import { TicketUtils } from '../../../shared/libs/ticket-utils';
import ReactTooltip from 'react-tooltip';
import { useAtom } from 'jotai';
import TicketDetailStore from '../../../stores/tickets/[id]';
import { Disclosure, Transition } from '@headlessui/react';
import { Accordion } from '../../../widgets/Accordion';
import { TicketHistoryService } from '../../../services/TicketHistoryService';
import { TicketService } from '../../../services/TicketService';
import { Ticket } from '../../../models/Ticket';

export default function TicketDetailManageStatus() {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const [resolutions] = useAtom(TicketDetailStore.resolutions);
  const [ticketStatuses, setTicketStatuses] = useAtom(
    TicketDetailStore.ticketStatuses
  );
  const [, setTicketHistories] = useAtom(
    TicketDetailStore.groupedTicketHistories
  );
  const [, setTicketDueDates] = useAtom(TicketDetailStore.ticketDueDates);
  const [statuses] = useAtom(TicketDetailStore.statuses);
  const [ticket, setTicket]: [Ticket, any] = useAtom(TicketDetailStore.ticket);

  const [reason, setReason] = useState('');
  const ticketService = new TicketService(user?.accessToken);
  const ticketStatusService = new TicketStatusService(user?.accessToken);
  const ticketDueDateService = new TicketDueDateService(user?.accessToken);
  const ticketHistoryService = new TicketHistoryService(user?.accessToken);

  const [, setCurrentTab] = useAtom(TicketDetailStore.currentTab);

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

    const message = `Are you sure you want to change the status from <b>${TicketUtils.getCurrentStatus(
      ticketStatuses
    )}</b> to <b>${statusName}</b> ${
      shouldFillReason ? `with reason: <b>${reason}</b>` : ''
    } ?`;
    if (await confirm(message)) {
      const dto: CreateTicketStatusDto = {
        ticketId: ticket.id,
        reason: reason || null,
        statusId: status.id,
        userId: user.id,
      };

      if (TicketUtils.getCurrentStatus(ticketStatuses) === STATUS.PENDING) {
        toast(
          'Ticket deadline has been extended due to previous ticket status is PENDING'
        );
      }

      const updateToast = toast('Updating ticket status...');

      const wrapper = new ClientPromiseWrapper(toast);
      const addedStatus = await wrapper.handle(ticketStatusService.add(dto));
      const ticketDueDates = await ticketDueDateService.getAllByTicketId(
        ticket.id
      );
      const histories = await ticketHistoryService.getAllByTicketIdGroupedByDate(ticket.id);
      const updatedTicket = await ticketService.get(ticket.id);
      
      setTicketDueDates(ticketDueDates);
      setTicketHistories(histories);
      setTicketStatuses([...ticketStatuses, addedStatus]);
      setTicket(updatedTicket);
      setReason('');

      toast.dismiss(updateToast);
      toast.success('Status updated succesfully');
    }
  };

  return (
    <Accordion defaultOpen={true} title="Manage Ticket Statuses">
      <TicketStatusChangeLogTable ticketStatuses={ticketStatuses} />

      <If condition={TicketUtils.isEligibleToManage(user, ticket)}>
        <Then>
          <div className="mt-4">
            <div>
              Current Status:{' '}
              <input
                className="border border-gray-300 rounded p-2 w-full"
                type="text"
                disabled
                value={TicketUtils.getCurrentStatus(ticketStatuses)}
              />
            </div>

            <Switch>
              <Case
                condition={
                  TicketUtils.getCurrentStatus(ticketStatuses) ===
                  STATUS.ASSIGNED
                }>
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

              <Case
                condition={
                  TicketUtils.getCurrentStatus(ticketStatuses) ===
                  STATUS.IN_PROGRESS
                }>
                <div>
                  {renderReasonInputText()}

                  <div className="flex justify-between mt-3 items-end">
                    <div
                      className="text-blue-500 text-xs font-semibold"
                      data-tip
                      data-for="admin-change-pending-ticket-info">
                      WHAT DOES PENDING STATUS MEAN ? HOVER ME
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => updateStatus(STATUS.PENDING, true)}
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-gray-800 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600">
                        <span className="hidden md:block">
                          Change Status to{' '}
                        </span>
                        <span className="font-bold ml-1">{STATUS.PENDING}</span>
                      </button>

                      <button
                        onClick={() => updateStatus(STATUS.RESOLVED, true)}
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600">
                        <span className="hidden md:block">
                          Change Status to{' '}
                        </span>
                        <span className="font-bold ml-1">
                          {STATUS.RESOLVED}
                        </span>
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <ReactTooltip
                    id="admin-change-pending-ticket-info"
                    place="right"
                    effect="solid">
                    <div>
                      <span className="block">
                        If you change the status to <b>Pending</b>, the due date
                        of this ticket will be <b>frozen (invalid)</b>.
                      </span>
                      <span className="block">
                        When you change the status to <b>In Progress</b> again,
                        then the due date will be updated with the following
                        formula:{' '}
                      </span>
                      <span>
                        <b>New due date</b> = old due date + time elapsed from{' '}
                        <b>Pending</b> to
                        <b> In Progress</b> again
                      </span>
                    </div>
                  </ReactTooltip>
                </div>
              </Case>

              <Case
                condition={
                  TicketUtils.getCurrentStatus(ticketStatuses) ===
                  STATUS.PENDING
                }>
                {renderReasonInputText()}

                <div className="flex space-x-4 justify-between mt-3">
                  <div
                    className="text-blue-500 text-xs font-semibold"
                    data-tip
                    data-for="admin-change-in-progress-ticket-info">
                    WHAT DOES PENDING STATUS MEAN ? HOVER ME
                  </div>

                  <button
                    onClick={() => updateStatus(STATUS.IN_PROGRESS, true)}
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="hidden md:block">Change Status to </span>
                    <span className="font-bold ml-1">{STATUS.IN_PROGRESS}</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>

                <ReactTooltip
                  id="admin-change-in-progress-ticket-info"
                  place="right"
                  effect="solid">
                  <div>
                    <span className="block">
                      If you change the status to <b>In Progress</b>, the due
                      date of this ticket will be be updated with the following
                      formula:.
                    </span>
                    <span>
                      <b>New due date</b> = old due date + time elapsed from{' '}
                      <b>Pending</b> to
                      <b> In Progress</b> again
                    </span>
                  </div>
                </ReactTooltip>
              </Case>

              <Case
                condition={
                  TicketUtils.getCurrentStatus(ticketStatuses) ===
                  STATUS.RESOLVED
                }>
                <div>
                  {renderReasonInputText()}

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
                      onClick={() => updateStatus(STATUS.CLOSED, false)}
                      type="button"
                      disabled={resolutions.length === 0}
                      className={`${
                        resolutions.length > 0
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

                  {resolutions.length === 0 && (
                    <div className="text-xs text-red-400 font-medium text-right mt-2">
                      *You must mark a message as resolution before the ticket
                      can be closed. Mark it in the <b>Details</b> tab or click{' '}
                      <button
                        className="text-blue-500 underline"
                        onClick={() => setCurrentTab('Details')}>
                        here
                      </button>
                    </div>
                  )}
                </div>
              </Case>
            </Switch>
          </div>
        </Then>
      </If>
    </Accordion>
  );
}
