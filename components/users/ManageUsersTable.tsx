import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { SessionUser } from '../../models/SessionUser';
import { User } from '../../models/User';
import { UserService } from '../../services/UserService';
import { confirm } from '../../shared/libs/confirm-dialog-helper';
import UserStore from '../../stores/manage/users';

type Props = {
    openModal: (user: User | null) => void;
}

export default function ManageUsersTable({ openModal }: Props) {
  const [users, setUsers] = useAtom(UserStore.users);
  const session = useSession();
  const sessionUser = session?.data?.user as SessionUser;

  const onDelete = async (user: User) => {
    const usersService = new UserService(sessionUser.accessToken);
    const message = `Are you sure you want to delete <b>${user.name}</b> ?`;
    if (await confirm(message)) {
      await toast.promise(
        usersService.deleteUser(user.id),
        {
          loading: 'Deleting User...',
          success: (r) => {
            setUsers(
              users.filter((u) => u.id !== user.id)
            );
            return 'Sucesfully deleted the selected user';
          },
          error: (e) => e.toString(),
        }
      );
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
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.role.roleName}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                        <button
                          type="button"
                          onClick={() => openModal(user)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(user)}
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
