import { Dialog, Transition } from '@headlessui/react';
import { SetStateAction, useAtom } from 'jotai';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { semestersAtom } from '../../atom';
import { CreateSemesterDto } from '../../models/dto/semesters/create-semester.dto';
import { Semester } from '../../models/Semester';
import { SemestersService } from '../../services/SemestersService';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  semester: Semester | null;
};

type FormData = {
  startYear: number;
  endYear: number;
  type: string;
  isActive: boolean;
};

export default function SemesterFormModal({
  isOpen,
  setIsOpen,
  semester,
}: Props) {
  const [semesters, setSemesters] = useAtom(semestersAtom);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setValue('startYear', semester?.startYear);
    setValue('endYear', semester?.endYear);
    setValue('type', semester?.type);
    setValue('isActive', false);
  }, [semester]);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    setLoading(true);
    await toast.promise(
      SemestersService.addSemester(payload as CreateSemesterDto),
      {
        loading: 'Adding semester...',
        success: (result) => {
          setSemesters([result, ...semesters]);
          setIsOpen(false);
          return `Succesfully added new semester`;
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
                  {semester ? 'Update' : 'Create'} Semester
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='mt-2 space-y-2'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Type
                    </label>
                    <select
                      {...register('type', {
                        required: true,
                      })}
                      className={`${
                        errors.type
                          ? 'border-red-300'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } mt-1 block w-full pl-3 outline-none pr-10 py-2 text-base border sm:text-sm rounded-md`}>
                      <option value=''>----- SELECT TYPE -----</option>
                      <option value='Even'>Even</option>
                      <option value='Odd'>Odd</option>
                    </select>
                    {errors.type?.type === 'required' && (
                      <small className='text-red-500'>
                        Type must be selected
                      </small>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Start year
                    </label>
                    <div className='mt-1'>
                      <input
                        {...register('startYear', {
                          required: true,
                        })}
                        type='number'
                        className={`${
                          errors.startYear
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder='2021'
                      />
                    </div>
                    {errors.startYear?.type === 'required' && (
                      <small className='text-red-500'>
                        Start year must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      End year
                    </label>
                    <div className='mt-1'>
                      <input
                        {...register('endYear', {
                          required: true,
                        })}
                        type='number'
                        className={`${
                          errors.endYear
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder='2022'
                      />
                    </div>
                    {errors.endYear?.type === 'required' && (
                      <small className='text-red-500'>
                        End year must be filled
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
                      {semester ? 'Update' : 'Create'}
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
