import { Dialog, Transition } from '@headlessui/react';
import { SetStateAction, useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CreateUserDto } from '../../models/dto/create-user.dto';
import { Role } from '../../models/Role';
import { SessionUser } from '../../models/SessionUser';
import { User } from '../../models/User';
import { usersAtom } from '../../pages/manage/users';
import { UserService } from '../../services/UserService';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  currRoles: Role[] | null;
};

type FormData = {
  name: string;
  code: string;
  email: string;
  department: string;
  jobTitle?: string;
  companyName?: string;
  officeLocation?: string;
  roleId: string;
};

const UserFormModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  user,
  currRoles,
}) => {
  const [users, setUsers] = useAtom(usersAtom);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const sessionUser = session?.data?.user as SessionUser;
  const usersService = new UserService(sessionUser.accessToken);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setValue('name', user?.name);
    setValue('code', user?.code);
    setValue('email', user?.email);
    setValue('department', user?.department);
    setValue('jobTitle', user?.jobTitle);
    setValue('companyName', user?.companyName);
    setValue('officeLocation', user?.officeLocation);
    setValue('roleId', user?.role.id);
  }, [user]);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    setLoading(true);
    await toast.promise(
      user
        ? usersService.updateUser(payload as CreateUserDto, user.id)
        : usersService.createUser(payload as CreateUserDto),
      {
        loading: user ? 'Updating user...' : 'Adding user...',
        success: (result) => {
          user
            ? setUsers(
                users.map((u) => {
                  if (u.id === user.id) return result;
                  else return u;
                })
              )
            : setUsers([result, ...users]);
          setIsOpen(false);

          setValue('name', '');
          setValue('code', '');
          setValue('email', '');
          setValue('department', '');
          setValue('jobTitle', '');
          setValue('companyName', '');
          setValue('officeLocation', '');

          return user
            ? `Successfully updated the user`
            : `Succesfully added new user`;
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
              <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900">
                  {user ? 'Update' : 'Create'} User
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Name
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('name', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.name
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="User Name"
                      />
                    </div>
                    {errors.name?.type === 'required' && (
                      <small className="text-red-500">
                        User name must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Code
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('code', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.code
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="User Code"
                      />
                    </div>
                    {errors.code?.type === 'required' && (
                      <small className="text-red-500">
                        User code must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Email
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('email', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.email
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="User Email"
                      />
                    </div>
                    {errors.email?.type === 'required' && (
                      <small className="text-red-500">
                        User email must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Department
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('department', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.department
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="User Department"
                      />
                    </div>
                    {errors.department?.type === 'required' && (
                      <small className="text-red-500">
                        User department must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Role
                    </label>
                    <select
                      {...register('roleId', {
                        required: true,
                      })}
                      className={`${
                        errors.department
                          ? 'border-red-300'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } mt-1 block w-full pl-3 outline-none pr-10 py-2 text-base border sm:text-sm rounded-md`}
                      >
                      <option value="">Select a role</option>
                      {currRoles.map((role, idx) => (
                        <option key={idx} value={role.id}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                    {errors.roleId?.type === 'required' && (
                      <small className="text-red-500">
                        User role must be selected
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Job Title
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('jobTitle', {
                          required: false,
                        })}
                        type="text"
                        className={`${
                          errors.jobTitle
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="User Job Title"
                      />
                    </div>
                    {/* {errors.jobTitle?.type === 'required' && (
                      <small className="text-red-500">
                        User job title must be filled
                      </small>
                    )} */}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Company Name
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('companyName', {
                          required: false,
                        })}
                        type="text"
                        className={`${
                          errors.companyName
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="User Company Name"
                      />
                    </div>
                    {/* {errors.companyName?.type === 'required' && (
                      <small className="text-red-500">
                        User company name must be filled
                      </small>
                    )} */}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Office Location
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('officeLocation', {
                          required: false,
                        })}
                        type="text"
                        className={`${
                          errors.officeLocation
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="User Office Location"
                      />
                    </div>
                    {/* {errors.officeLocation?.type === 'required' && (
                      <small className="text-red-500">
                        User office location must be filled
                      </small>
                    )} */}
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
                      {user ? 'Update' : 'Create'}
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
};

export default UserFormModal;
