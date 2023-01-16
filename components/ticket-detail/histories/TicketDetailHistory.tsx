import { Disclosure, Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ChevronUpIcon,
  ExclamationCircleIcon,
  LightningBoltIcon,
  LockClosedIcon,
  PencilAltIcon,
} from '@heroicons/react/solid';
import { format } from 'date-fns';
import { useAtom } from 'jotai';
import { Fragment } from 'react';
import { TicketHistoryType } from '../../../shared/constants/ticket-history-type';
import TicketDetailStore from '../../../stores/tickets/[id]';

const TicketDetailHistory = () => {
  const [groupedTicketHistories] = useAtom(
    TicketDetailStore.groupedTicketHistories
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case TicketHistoryType.CREATED:
        return <PencilAltIcon className="h-5 w-5" />;
      case TicketHistoryType.INPROGRESS:
        return <LightningBoltIcon className="h-5 w-5" />;
      case TicketHistoryType.PENDING:
        return <ExclamationCircleIcon className="h-5 w-5" />;
      case TicketHistoryType.RESOLVED:
        return <CheckCircleIcon className="h-5 w-5" />;
      case TicketHistoryType.CLOSED:
        return <LockClosedIcon className="h-5 w-5" />;
      case TicketHistoryType.UPDATED:
        return <PencilAltIcon className="h-5 w-5" />;
      default:
        return <PencilAltIcon className="h-5 w-5" />;
    }
  };

  return (
    <div>
      {groupedTicketHistories.length > 0 &&
        groupedTicketHistories.map((groupedHistory) => {
          const ticketHistories = groupedHistory.histories;

          return (
            <Disclosure defaultOpen key={groupedHistory.date}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="border border-blue-200 flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-sky-900 bg-sky-100 rounded-lg hover:bg-sky-200 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75">
                    <span className="font-bold">{groupedHistory.date}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'transform rotate-180' : ''
                      } w-5 h-5 text-sky-500`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-300 ease-in-out"
                    enterFrom="transform scale-50 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-300 ease-in"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-50 opacity-0">
                    <Disclosure.Panel className="px-4 pb-2 text-sm text-gray-700">
                      <div>
                        {ticketHistories.map((ticketHistory) => {
                          const ticketHistoryData = JSON.parse(
                            ticketHistory.data
                          );
                          return (
                            <table
                              key={ticketHistory.id}
                              className="min-w-full table-fixed">
                              <colgroup>
                                <col className="w-1/6" />
                                <col className="w-1/6" />
                                <col className="w-2/3" />
                              </colgroup>
                              <tbody>
                                <tr className="border-b">
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {format(
                                      new Date(ticketHistory.created_at),
                                      'HH:mm'
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                      {getTypeIcon(ticketHistory.type)}
                                      <span className="ml-2">
                                        {ticketHistory.type}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600 break-words">
                                    <div className="mb-1">
                                      by
                                      <span className="font-bold ml-2">
                                        {ticketHistoryData.createdBy
                                          ? ticketHistoryData.createdBy
                                          : ticketHistoryData.created_by
                                          ? ticketHistoryData.created_by
                                          : '(No Data)'}
                                      </span>
                                    </div>
                                    {ticketHistory.type ===
                                      TicketHistoryType.CREATED && (
                                      <Fragment>
                                        <div className="mb-1">
                                          Assigned to
                                          <span className="font-bold ml-2">
                                            {ticketHistoryData.assignedTo
                                              ? ticketHistoryData.assignedTo
                                              : '(No Data)'}
                                          </span>
                                        </div>
                                        <div className="mb-1">
                                          Category is set to
                                          <span className="font-bold ml-2">
                                            {ticketHistoryData.category
                                              ? ticketHistoryData.category
                                              : '(No Data)'}
                                          </span>
                                        </div>
                                        <div className="mb-1">
                                          Priority is set to
                                          <span className="font-bold ml-2">
                                            {ticketHistoryData.priority
                                              ? ticketHistoryData.priority
                                              : '(No Data)'}
                                          </span>
                                        </div>
                                        <div className="mb-1">
                                          Due By Date is set to
                                          <span className="font-bold ml-2">
                                            {ticketHistoryData.dueBy
                                              ? format(
                                                  new Date(
                                                    ticketHistoryData.dueBy
                                                  ),
                                                  'dd-MM-yyyy HH:mm'
                                                )
                                              : '(No Data)'}
                                          </span>
                                        </div>
                                      </Fragment>
                                    )}

                                    {ticketHistory.type ===
                                      TicketHistoryType.UPDATED &&
                                      ticketHistoryData.dueByChanged && (
                                        <div className="mb-1">
                                          Due By Date is updated from
                                          <span className="font-bold ml-2 mr-2">
                                            {ticketHistoryData.dueByChanged &&
                                            ticketHistoryData.dueByChanged.from
                                              ? format(
                                                  new Date(
                                                    ticketHistoryData.dueByChanged.from
                                                  ),
                                                  'dd-MM-yyyy HH:mm'
                                                )
                                              : '(No Data)'}
                                          </span>
                                          to{' '}
                                          <span className="font-bold ml-2">
                                            {ticketHistoryData.dueByChanged &&
                                            ticketHistoryData.dueByChanged.to
                                              ? format(
                                                  new Date(
                                                    ticketHistoryData.dueByChanged.to
                                                  ),
                                                  'dd-MM-yyyy HH:mm'
                                                )
                                              : '(No Data)'}
                                          </span>
                                        </div>
                                      )}

                                    {ticketHistory.type ===
                                      TicketHistoryType.UPDATED &&
                                      ticketHistoryData.senderNameChanged && (
                                        <div className="mb-1">
                                          Sender name is changed from
                                          <span className="font-bold ml-2 mr-2">
                                            {ticketHistoryData.senderNameChanged &&
                                            ticketHistoryData.senderNameChanged
                                              .from
                                              ? ticketHistoryData
                                                  .senderNameChanged.from
                                              : '(No Data)'}
                                          </span>
                                          to
                                          <span className="font-bold ml-2">
                                            {ticketHistoryData.senderNameChanged &&
                                            ticketHistoryData.senderNameChanged
                                              .to
                                              ? ticketHistoryData
                                                  .senderNameChanged.to
                                              : '(No Data)'}
                                          </span>
                                        </div>
                                      )}

                                    {ticketHistory.type ===
                                      TicketHistoryType.UPDATED &&
                                      ticketHistoryData.senderEmailChanged && (
                                        <div className="mb-1">
                                          Sender email is changed from
                                          <span className="font-bold ml-2 mr-2">
                                            {ticketHistoryData.senderEmailChanged &&
                                            ticketHistoryData.senderEmailChanged
                                              .from
                                              ? ticketHistoryData
                                                  .senderEmailChanged.from
                                              : '(No Data)'}
                                          </span>
                                          to
                                          <span
                                            className="font-bold ml-2"
                                            style={{ wordBreak: 'break-word' }}>
                                            {ticketHistoryData.senderEmailChanged &&
                                            ticketHistoryData.senderEmailChanged
                                              .to
                                              ? ticketHistoryData
                                                  .senderEmailChanged.to
                                              : '(No Data)'}
                                          </span>
                                        </div>
                                      )}

                                    {(ticketHistory.type ===
                                      TicketHistoryType.INPROGRESS ||
                                      ticketHistory.type ===
                                        TicketHistoryType.PENDING ||
                                      ticketHistory.type ===
                                        TicketHistoryType.RESOLVED ||
                                      ticketHistory.type ===
                                        TicketHistoryType.CLOSED) && (
                                      <Fragment>
                                        <div className="mb-1 break-words">
                                          Status changed from
                                          <span className="font-bold ml-2 mr-2">
                                            {ticketHistoryData.from
                                              ? ticketHistoryData.from
                                              : '(No Data)'}
                                          </span>
                                        </div>
                                        {ticketHistoryData.reason && (
                                          <div className="mb-1">
                                            Reason
                                            <span className="font-bold ml-2 mr-2">
                                              {ticketHistoryData.reason
                                                ? ticketHistoryData.reason
                                                : '(No Data)'}
                                            </span>
                                          </div>
                                        )}
                                      </Fragment>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          );
                        })}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          );
        })}
    </div>
  );
};

export default TicketDetailHistory;
