import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { SessionUser } from '../../models/SessionUser';
import { User } from '../../models/User';
import { UserService } from '../../services/UserService';
import { confirm } from '../../shared/libs/confirm-dialog-helper';
import ManageUserStore from '../../stores/manage/users';
import GeneralTable from '../GeneralTable';

type Props = {
  openModal: (user: User | null) => void;
};

export default function ManageUsersTable({ openModal }: Props) {
  const [users, setUsers] = useAtom(ManageUserStore.users);
  const columnHelper = createColumnHelper<User>();
  const columns = [
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
      header: 'Name',
    }),
    columnHelper.accessor('code', {
      cell: (info) => info.getValue(),
      header: 'Code',
    }),
    columnHelper.accessor('email', {
      cell: (info) => info.getValue(),
      header: 'Email',
    }),
    columnHelper.accessor('department', {
      cell: (info) => info.getValue(),
      header: 'Department',
    }),
    columnHelper.accessor('role.roleName', {
      cell: (info) => info.getValue(),
      header: 'Role',
    }),
    columnHelper.display({
      id: 'action',
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => openModal(info.row.original)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Update
          </button>
          <button
            type="button"
            onClick={() => onDelete(info.row.original)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Delete
          </button>
        </div>
      ),
      header: '',
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const session = useSession();
  const sessionUser = session?.data?.user as SessionUser;

  const onDelete = async (user: User) => {
    const usersService = new UserService(sessionUser.accessToken);
    const message = `Are you sure you want to delete <b>${user.name}</b> ?`;
    if (await confirm(message)) {
      await toast.promise(usersService.deleteUser(user.id), {
        loading: 'Deleting User...',
        success: (r) => {
          setUsers(users.filter((u) => u.id !== user.id));
          return 'Sucesfully deleted the selected user';
        },
        error: (e) => e.toString(),
      });
    }
  };

  return <GeneralTable table={table} />;
}
