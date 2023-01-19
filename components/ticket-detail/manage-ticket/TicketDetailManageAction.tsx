import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SessionUser } from '../../../models/SessionUser';
import { TicketService } from '../../../services/TicketService';
import { STATUS } from '../../../shared/constants/status';
import TicketDetailStore from '../../../stores/tickets/[id]';
import ChangeSenderInfoModal from './ChangeSenderInfoModal';
import { confirm } from '../../../shared/libs/confirm-dialog-helper';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';

export default function TicketDetailManageAction() {
  const [ticket] = useAtom(TicketDetailStore.ticket);
  const [ticketStatuses] = useAtom(TicketDetailStore.ticketStatuses);

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const ticketService = new TicketService(user?.accessToken);
  const router = useRouter();

  const [enableDeleteButton, setEnableDeleteButton] = useState(true);
  const [showChangeSenderInfoModal, setShowChangeSenderInfoModal] =
    useState(false);

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

  const renderDeleteAction = () => {
    return (
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
    );
  };

  const renderChangeSenderInfoAction = () => {
    return (
      <div className="p-4 border border-blue-300 rounded bg-blue-50 flex flex-col md:flex-row justify-between">
        <div className="text-sm">
          <h3 className="font-medium">Update sender name or email</h3>
          <p>
            Useful if the sender is not using binus domain email (ex: using
            gmail instead of binus.ac.id or binus.edu)
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowChangeSenderInfoModal(true)}
            type="button"
            className={`bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white w-full justify-center text-center mt-2 md:mt-0 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}>
            Change
          </button>
        </div>
      </div>
    );
  };

  return (
    <Disclosure as="div" className="mt-6">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`${
              open ? 'rounded-t' : 'rounded'
            } flex justify-between w-full px-4 py-2 text-sm border border-gray-300 font-medium text-left text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}>
            <span className="font-bold">Other Actions</span>
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
              <div className="space-y-4">
                {renderChangeSenderInfoAction()}
                {renderDeleteAction()}
              </div>

              <ChangeSenderInfoModal
                isOpen={showChangeSenderInfoModal}
                setIsOpen={setShowChangeSenderInfoModal}
                ticket={ticket}
              />
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
