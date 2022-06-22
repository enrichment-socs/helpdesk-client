import { Dialog, Transition } from '@headlessui/react';
import { SetStateAction, useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CreatePriorityDto } from '../../models/dto/priority/create-prioritiy.dto';
import { Priority } from '../../models/Priority';
import { SessionUser } from '../../models/SessionUser';
import { prioritiesAtom } from '../../pages/manage/priorities';
import { PriorityService } from '../../services/PriorityService';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  priority: Priority | null;
};

type FormData = {
  priorityName: string;
  priorityIndex: number;
  deadlineHours: number;
};

export default function PrioritiesFormModal({
  isOpen,
  setIsOpen,
  priority,
}: Props) {
  const [prioritiesVal, setprioritiesVal] = useAtom(prioritiesAtom);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const prioritiesService = new PriorityService(user.accessToken);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setValue('priorityName', priority?.priorityName);
    setValue('priorityIndex', priority?.priorityIndex);
    setValue('deadlineHours', priority?.deadlineHours);
  }, [priority]);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    setLoading(true);
    await toast.promise(
      priority
        ? prioritiesService.update(payload as CreatePriorityDto, priority.id)
        : prioritiesService.add(payload as CreatePriorityDto),
      {
        loading: priority ? 'Updating priority...' : 'Adding priority...',
        success: (result) => {
          priority
            ? setprioritiesVal(
                prioritiesVal.map((p) => {
                  if (p.id === priority.id) return result;
                  else return p;
                })
              )
            : setprioritiesVal([...prioritiesVal, result]);
          setIsOpen(false);
          setValue('priorityName', '');
          setValue('priorityIndex', 0);
          setValue('deadlineHours', 0);
          return priority
            ? `Successfully updated the priority`
            : `Succesfully added new priority`;
        },
        error: (e) => e.toString(),
      }
    );
    setLoading(false);
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

            {/* This element is to trick the browser into centering the modal contents. */}
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
                  {priority ? 'Update' : 'Create'} Priority
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Priority Name
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('priorityName', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.priorityName
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="Priority Name"
                      />
                    </div>
                    {errors.priorityName?.type === 'required' && (
                      <small className="text-red-500">
                        Priority Name must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Priority Index
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('priorityIndex', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.priorityIndex
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="Priority Index"
                      />
                    </div>
                    {errors.priorityIndex?.type === 'required' && (
                      <small className="text-red-500">
                        Priority Index name must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deadline Hours
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('deadlineHours', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.deadlineHours
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="Deadline Hours"
                      />
                    </div>
                    {errors.deadlineHours?.type === 'required' && (
                      <small className="text-red-500">
                        Deadline hours must be filled
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
                      {priority ? 'Update' : 'Create'}
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
