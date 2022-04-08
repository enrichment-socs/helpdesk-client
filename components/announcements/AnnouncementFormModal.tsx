import { Dialog, Transition } from '@headlessui/react';
import { SetStateAction, useAtom } from 'jotai';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Announcement } from '../../models/Announcement';
import { CreateAnnouncementDto } from '../../models/dto/announcements/create-announcement.dto';
import { announcementsAtom } from '../../pages/manage/announcements';
import { AnnouncementsService } from '../../services/AnnouncementService';
import { activeSemesterAtom } from '../../atom';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  announcement: Announcement | null;
};

type FormData = {
  title: string;
  body: string;
  due_by: Date;
};

export default function AnnouncementFormModal({
  isOpen,
  setIsOpen,
  announcement,
}: Props) {
  const [announcements, setAnnouncements] = useAtom(announcementsAtom);
  const [loading, setLoading] = useState(false);
  const [activeSemester] = useAtom(activeSemesterAtom);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setValue('title', announcement?.title);
    setValue('body', announcement?.body);
    setValue('due_by', announcement?.due_by);
  }, [announcement]);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    const dto: CreateAnnouncementDto = {
      ...payload,
      semesterId: activeSemester.id,
    };

    setLoading(true);
    await toast.promise(
      announcement
        ? AnnouncementsService.updateAnnouncement(dto, announcement.id)
        : AnnouncementsService.addAnnouncement(dto),
      {
        loading: announcement
          ? 'Updating announcement...'
          : 'Adding announcement...',
        success: (result) => {
          announcement
            ? setAnnouncements(
                announcements.map((a) => {
                  if (a.id === announcement.id) return result;
                  else return a;
                }),
              )
            : setAnnouncements([result, ...announcements]);
          setIsOpen(false);
          setValue('title', '');
          return announcement
            ? `Successfully updated the announcement`
            : `Succesfully added new announcement`;
        },
        error: (e) => e.toString(),
      },
    );
    setLoading(false);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={() => setIsOpen(false)}>
          <div
            className='min-h-screen px-4 text-center'
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className='inline-block h-screen align-middle'
              aria-hidden='true'>
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'>
                  {announcement ? 'Update' : 'Create'} Announcement
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='mt-2 space-y-2'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Announcement Title
                    </label>
                    <div className='mt-1'>
                      <input
                        {...register('title', {
                          required: true,
                        })}
                        type='text'
                        className={`${
                          errors.title
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder='Learning Plan Information'
                      />
                    </div>
                    {errors.title?.type === 'required' && (
                      <small className='text-red-500'>
                        Title must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Announcement Body
                    </label>
                    <div className='mt-1'>
                      <textarea
                        {...register('body', {
                          required: true,
                        })}
                        className={`${
                          errors.body
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder='Information Details'
                      />
                    </div>
                    {errors.body?.type === 'required' && (
                      <small className='text-red-500'>
                        Body must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Announcement Due By
                    </label>
                    <div className='mt-1'>
                      <input
                        {...register('due_by', {
                          required: true,
                          setValueAs: (value) => new Date(value),
                        })}
                        type='datetime-local'
                        className={`${
                          errors.due_by
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder='Select a date'
                      />
                    </div>
                    {errors.due_by?.type === 'required' && (
                      <small className='text-red-500'>
                        Due by must be chosen
                      </small>
                    )}
                  </div>

                  <div className='mt-4 text-right'>
                    <button
                      type='submit'
                      disabled={loading}
                      className={`${
                        loading
                          ? 'text-gray-600 bg-gray-400'
                          : 'text-blue-900 bg-blue-100 hover:bg-blue-200'
                      } inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}>
                      {announcement ? 'Update' : 'Create'}
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
