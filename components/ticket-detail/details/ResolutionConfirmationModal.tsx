import { Dialog, Transition } from '@headlessui/react';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SessionUser } from '../../../models/SessionUser';
import TicketDetailStore from '../../../stores/tickets/[id]';

type FormData = {
  reason: string;
};

export default function ResolutionConfirmationModal() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useAtom(
    TicketDetailStore.openConfirmResolutionModal
  );
  const [messageId] = useAtom(TicketDetailStore.selectedOutlookMessageId);

  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async ({ reason }) => {
    setLoading(true);
    await toast.promise(new Promise(() => {}), {
      success: () => {
        setLoading(false);
        setIsOpen(false);
        router.replace(router.asPath);
        return 'Resolution updated!';
      },
      loading: 'Marking this message as resolution...',
      error: (e) => {
        console.error(e);
        return 'Failed when marking this message as resolution, please contact developer';
      },
    });
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
                  Mark this message as resolution
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm text-gray-500">
                      Are you sure you want to mark this message as resolution ?
                      Please state your reason below:
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('reason', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.reason
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="Input reason..."
                      />
                    </div>
                    {errors.reason?.type === 'required' && (
                      <small className="text-red-500">
                        Reason must be filled
                      </small>
                    )}
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
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
