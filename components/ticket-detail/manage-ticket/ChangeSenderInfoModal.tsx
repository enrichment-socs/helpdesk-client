import { Dialog, Transition } from '@headlessui/react';
import { SetStateAction } from 'jotai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SessionUser } from '../../../models/SessionUser';
import { Ticket } from '../../../models/Ticket';
import { TicketService } from '../../../services/TicketService';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  ticket: Ticket;
};

type FormData = {
  senderName: string;
  senderEmail: string;
};

export default function ChangeSenderInfoModal({
  isOpen,
  setIsOpen,
  ticket,
}: Props) {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const ticketService = new TicketService(user?.accessToken);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setValue('senderName', ticket?.senderName);
    setValue('senderEmail', ticket?.senderEmail);
  }, []);

  const onSubmit: SubmitHandler<FormData> = async ({
    senderName,
    senderEmail,
  }) => {
    setLoading(true);
    await toast.promise(
      ticketService.updateSenderInfo(ticket.id, { senderName, senderEmail }),
      {
        success: () => {
          setLoading(false);
          setIsOpen(false);
          router.replace(router.asPath);
          return 'Sender info updated!';
        },
        loading: 'Updating...',
        error: (e) => {
          console.error(e);
          return 'Failed when updating sender info, please contact developer';
        },
      }
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
                  Update Sender Info
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sender Name
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('senderName', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.senderName
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="Sender name"
                      />
                    </div>
                    {errors.senderName?.type === 'required' && (
                      <small className="text-red-500">
                        Sender name must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sender Email
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('senderEmail', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.senderEmail
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="Sender email"
                      />
                    </div>
                    {errors.senderEmail?.type === 'required' && (
                      <small className="text-red-500">
                        Sender email must be filled
                      </small>
                    )}
                  </div>

                  <div className="mt-4 text-right">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`${
                        loading
                          ? 'text-gray-600 bg-gray-400'
                          : 'text-blue-900 bg-blue-100 hover:bg-blue-200'
                      } inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}>
                      Update
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
