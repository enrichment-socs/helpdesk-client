import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon, PencilAltIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';
import { useAtom } from 'jotai';
import TicketDetailStore from '../../../stores/tickets/[id]';

const TicketDetailHistory = () => {
  const [ticketHistories] = useAtom(TicketDetailStore.ticketHistories);

  return (
    <div>
      {ticketHistories &&
        ticketHistories.map((ticketHistory) => {
          const ticketHistoryData = JSON.parse(ticketHistory.data);

          return (
            <Disclosure defaultOpen key={ticketHistory.id}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-sky-900 bg-sky-100 rounded-lg hover:bg-sky-200 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75">
                    <span className="font-bold">
                      {format(
                        new Date(ticketHistory.created_at),
                        'MMM dd, yyyy'
                      )}
                    </span>
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
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-700">
                      <div>
                        <table className="min-w-full">
                          <tbody>
                            <tr className="border-b">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {format(
                                  new Date(ticketHistory.created_at),
                                  'hh:mm b'
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                <div className="flex items-center">
                                  <PencilAltIcon className="h-5 w-5" />
                                  <span className="ml-2">
                                    {ticketHistory.type}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                <div className="mb-1">
                                  by
                                  <span className="font-bold ml-2">
                                    {ticketHistoryData.createdBy
                                      ? ticketHistoryData.createdBy
                                      : '(No Data)'}
                                  </span>
                                </div>
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
                                          new Date(ticketHistoryData.dueBy),
                                          'dd-MM-yyyy hh:mm b'
                                        )
                                      : '(No Data)'}
                                  </span>
                                </div>
                              </td>
                            </tr>

                            {/* <tr className="border-b">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              02:04 PM
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              <div className="flex items-center">
                                <PencilAltIcon className="h-5 w-5" />
                                <span className="ml-2">Seen</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              <div className="mb-1">
                                by
                                <span className="font-bold ml-2">
                                  SDP - SSG 7 Cluster 1
                                </span>
                              </div>
                              <div className="mb-1">
                                ISREAD changed from
                                <span className="font-bold ml-2">false</span>
                                <span className="ml-2">to</span>
                                <span className="font-bold ml-2">true</span>
                              </div>
                            </td>
                          </tr> */}
                          </tbody>
                        </table>
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
