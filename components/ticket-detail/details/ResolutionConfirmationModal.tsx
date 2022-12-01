import { Dialog, Transition } from '@headlessui/react';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CreateTicketResolutionDto } from '../../../models/dto/ticket-resolutions/create-ticket-resolution.dto';
import { SessionUser } from '../../../models/SessionUser';
import { TicketResolutionService } from '../../../services/TicketResolutionService';
import { STATUS } from '../../../shared/constants/status';
import TicketDetailStore from '../../../stores/tickets/[id]';

type FormData = {
  reason: string;
};

export default function ResolutionConfirmationModal() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useAtom(
    TicketDetailStore.openConfirmResolutionModal
  );
  const [messageId, setMessageId] = useAtom(
    TicketDetailStore.selectedOutlookMessageId
  );
  const [conversationId, setConversationId] = useAtom(
    TicketDetailStore.selectedConversationId
  );

  const [ticket] = useAtom(TicketDetailStore.ticket);
  const [, setResolutions] = useAtom(TicketDetailStore.resolutions) as any; //workaround because the setter type is never
  const [ticketStatuses] = useAtom(TicketDetailStore.ticketStatuses);
  const latestStatus = ticketStatuses
    ? ticketStatuses[ticketStatuses.length - 1]
    : null;

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const resolutionService = new TicketResolutionService(user?.accessToken);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async ({ reason }) => {
    const dto: CreateTicketResolutionDto = {
      conversationId,
      resolution: reason ?? '',
      ticketId: ticket.id,
      messageId,
    };

    setLoading(true);
    await toast.promise(resolutionService.add(dto), {
      success: () => {
        handlePostSuccess();
        return 'Resolution updated!';
      },
      loading: 'Marking this message as resolution...',
      error: (e) => {
        console.error(e);
        setLoading(false);
        return e.message;
      },
    });
  };

  const handlePostSuccess = async () => {
    const newestResolutions = await resolutionService.getByTicketId(ticket.id);
    setLoading(false);
    setIsOpen(false);
    setMessageId('');
    setConversationId('');
    setValue('reason', '');
    setResolutions(newestResolutions);
  };

  const canCreateResolution = () => {
    return (
      latestStatus &&
      (latestStatus.status.statusName === STATUS.RESOLVED ||
        latestStatus.status.statusName === STATUS.CLOSED)
    );
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsOpen(false)}>
          <div
            className="min-h-screen px-4 text-center"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900">
                  {latestStatus &&
                  latestStatus.status.statusName === STATUS.RESOLVED
                    ? 'Mark this message as resolution'
                    : 'Ticket not resolved'}
                </Dialog.Title>
                {canCreateResolution() ? (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-2 space-y-2">
                    <div>
                      <label className="block text-sm text-gray-500">
                        Are you sure you want to mark this message as resolution
                        ? Please state your reason below (optional):
                      </label>
                      <div className="mt-1">
                        <input
                          {...register('reason')}
                          type="text"
                          className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                          placeholder="Input reason..."
                        />
                      </div>
                    </div>

                    <div className="mt-4 text-right">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => setIsOpen(false)}
                        className={`${
                          loading
                            ? 'text-gray-600 bg-gray-400'
                            : 'text-red-900 bg-red-100 hover:bg-red-200'
                        } mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500`}>
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`${
                          loading
                            ? 'text-gray-600 bg-gray-400'
                            : 'text-blue-900 bg-blue-100 hover:bg-blue-200'
                        } inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}>
                        Submit
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-2">
                    <div className="text-red-400 text-sm">
                      This ticket must be <b>resolved</b> first before you can
                      mark this message as resolution.
                    </div>

                    <div className="mt-4 text-right">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => setIsOpen(false)}
                        className={`text-gray-900 bg-gray-100 hover:bg-gray-200 mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500`}>
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
