import { Dialog, Transition } from '@headlessui/react';
import { SetStateAction, useAtom } from 'jotai';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Announcement } from '../../models/Announcement';
import { CreateAnnouncementDto } from '../../models/dto/announcements/create-announcement.dto';
import { AnnouncementService } from '../../services/AnnouncementService';
import { activeSemesterAtom } from '../../atom';
import dynamic from 'next/dynamic';
import { add } from 'date-fns';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../models/SessionUser';
import { DateHelper } from '../../shared/libs/date-helper';
import { Role } from '../../models/Role';
import ManageAnnouncementStore from '../../stores/manage/announcements';
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
const DatePicker = dynamic(import('react-datepicker'), { ssr: false }) as any;

const modules = {
  toolbar: [
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'video'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  announcement: Announcement | null;
  roles: Role[];
};

type FormData = {
  title: string;
  body: string;
  startDate: Date;
  endDate: Date;
  roleId?: string;
};

export default function AnnouncementFormModal({
  isOpen,
  setIsOpen,
  announcement,
  roles,
}: Props) {
  const [announcements, setAnnouncements] = useAtom(ManageAnnouncementStore.announcements);
  const [loading, setLoading] = useState(false);
  const [activeSemester] = useAtom(activeSemesterAtom);
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const currDateRounded = DateHelper.roundUpHours(new Date());
    const nextWeekRounded = DateHelper.roundUpHours(
      add(new Date(), { weeks: 1 })
    );

    setValue('title', announcement?.title);
    setValue('roleId', announcement?.role?.id);

    register('startDate', { required: true });
    setValue(
      'startDate',
      announcement ? new Date(announcement.startDate) : currDateRounded
    );

    register('endDate', { required: true });
    setValue(
      'endDate',
      announcement ? new Date(announcement.endDate) : nextWeekRounded
    );

    register('body', { required: true });
    setValue('body', announcement?.body);
  }, [announcement, register, setValue]);

  const bodyContent = watch('body') || '';
  const startDateVal = watch('startDate') || new Date();
  const endDateVal = watch('endDate') || new Date();

  const onBodyChange = (val) => setValue('body', val);
  const onStartDateChange = (date) => setValue('startDate', date);
  const onEndDateChange = (date) => setValue('endDate', date);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    const dto: CreateAnnouncementDto = {
      ...payload,
    };

    if (!dto.roleId) dto.roleId = null;
    if (!announcement) dto.semesterId = activeSemester.id;
    const announcementService = new AnnouncementService(user.accessToken);

    setLoading(true);
    await toast.promise(
      announcement
        ? announcementService.updateAnnouncement(dto, announcement.id)
        : announcementService.addAnnouncement(dto),
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
                })
              )
            : setAnnouncements([...announcements, result]);
          setIsOpen(false);
          setValue('title', '');
          return announcement
            ? `Successfully updated the announcement`
            : `Succesfully added new announcement`;
        },
        error: (e) => e.toString(),
      }
    );
    setLoading(false);
    reset();
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
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900">
                  {announcement ? 'Update' : 'Create'} Announcement
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Announcement Title
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('title', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.title
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="Learning Plan Information"
                      />
                    </div>
                    {errors.title?.type === 'required' && (
                      <small className="text-red-500">
                        Title must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Announcement Body
                    </label>
                    <div className="mt-1">
                      <QuillNoSSRWrapper
                        modules={modules}
                        theme="snow"
                        value={bodyContent}
                        onChange={(content) => onBodyChange(content)}
                      />
                    </div>
                    {errors.body?.type === 'required' && (
                      <small className="text-red-500">
                        Body must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Target Role
                    </label>
                    <select
                      {...register('roleId')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      defaultValue="">
                      <option value="">All</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Announcement Show Start Date
                    </label>
                    <div className="mt-1">
                      <DatePicker
                        selected={startDateVal}
                        showTimeSelect
                        dateFormat="Pp"
                        onChange={onStartDateChange}
                        className={`${
                          errors.startDate
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                      />
                    </div>
                    {errors.startDate?.type === 'required' && (
                      <small className="text-red-500">
                        Start Date must be chosen
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Announcement Show End Date
                    </label>
                    <div className="mt-1">
                      <DatePicker
                        selected={endDateVal}
                        showTimeSelect
                        dateFormat="Pp"
                        onChange={onEndDateChange}
                        className={`${
                          errors.endDate
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                      />
                    </div>
                    {errors.endDate?.type === 'required' && (
                      <small className="text-red-500">
                        End Date must be chosen
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
