import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { confirm } from '../../shared/libs/confirm-dialog-helper';
import { Role } from '../../models/Role';
import { rolesAtom } from '../../pages/manage/roles';
import { RolesService } from '../../services/RolesService';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../models/SessionUser';

type Props = {
  roles: Role[];
  openModal: (role: Role | null) => void;
};

export default function ManageRolesTable({ roles, openModal }: Props) {
  const [, setRoles] = useAtom(rolesAtom);
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const rolesService = new RolesService(user.accessToken);

  const onDelete = async (role: Role) => {
    const message = `Are you sure you want to delete <b>${role.roleName} </b> ?`;
    if (await confirm(message)) {
      await toast.promise(rolesService.deleteRole(role.id), {
        loading: 'Deleting role...',
        success: (r) => {
          setRoles(roles.filter((s) => s.id !== role.id));
          return 'Sucesfully deleted the selected role';
        },
        error: (e) => e.toString(),
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Role Name
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles &&
                  roles.map((role, idx) => (
                    <tr
                      key={role.id}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {role.roleName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                        <button
                          type="button"
                          onClick={() => openModal(role)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(role)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
