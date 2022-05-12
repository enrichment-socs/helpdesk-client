import { Dialog, Transition } from '@headlessui/react';
import { SetStateAction, useAtom } from 'jotai';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CreateRoleDto } from '../../models/dto/roles/create-role.dto';
import { Role } from '../../models/Role';
import { rolesAtom } from '../../pages/manage/roles';
import { RolesService } from '../../services/RolesService';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../models/SessionUser';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  role: Role | null;
};

type FormData = {
  roleName: string;
};

export default function RoleFormModal({ isOpen, setIsOpen, role }: Props) {
  const [roles, setRoles] = useAtom(rolesAtom);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const rolesService = new RolesService(user.accessToken);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setValue('roleName', role?.roleName);
  }, [role]);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    setLoading(true);
    await toast.promise(
      role
        ? rolesService.updateRole(payload as CreateRoleDto, role.id)
        : rolesService.addRole(payload as CreateRoleDto),
      {
        loading: role ? 'Updating role...' : 'Adding role...',
        success: (result) => {
          role
            ? setRoles(
                roles.map((r) => {
                  if (r.id === role.id) return result;
                  else return r;
                })
              )
            : setRoles([result, ...roles]);
          setIsOpen(false);
          setValue('roleName', '');
          return role
            ? `Successfully updated the role`
            : `Succesfully added new role`;
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
                  {role ? 'Update' : 'Create'} Role
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role Name
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('roleName', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.roleName
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="User"
                      />
                    </div>
                    {errors.roleName?.type === 'required' && (
                      <small className="text-red-500">
                        Role name must be filled
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
                      {role ? 'Update' : 'Create'}
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
