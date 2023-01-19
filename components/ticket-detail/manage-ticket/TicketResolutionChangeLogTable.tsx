import { format } from 'date-fns';
import { useAtom } from 'jotai';
import TicketDetailStore from '../../../stores/tickets/[id]';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';

export default function TicketResolutionChangeLogTable() {
  const [resolutions] = useAtom(TicketDetailStore.resolutions);

  return (
    <Disclosure as="div" className="mt-6">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`${
              open ? 'rounded-t' : 'rounded'
            } flex justify-between w-full px-4 py-2 text-sm border border-gray-300 font-medium text-left text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}>
            <span className="font-bold">Ticket Resolution History</span>
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
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="rounded overflow-hidden border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-500">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              No.
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Message ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Reason
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Created at
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"></th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {resolutions.length == 0 && (
                            <tr className="text-center">
                              <td colSpan={6} className="p-4">
                                There are currently no resolution for this
                                ticket
                              </td>
                            </tr>
                          )}

                          {resolutions &&
                            resolutions.map((data, index) => (
                              <tr
                                key={data.id}
                                className={`${
                                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } `}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {data.messageId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {data.resolution}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {format(
                                    new Date(data.created_at),
                                    'dd MMM yyyy, kk:mm'
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {index === resolutions.length - 1 && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-400 text-gray-100">
                                      Current
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
