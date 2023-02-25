import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Priority } from '../../models/Priority';
import { SessionUser } from '../../models/SessionUser';
import { PriorityService } from '../../services/PriorityService';
import { confirm } from '../../shared/libs/confirm-dialog-helper';
import GeneralTable from '../GeneralTable';

type Prop = {
  priorities: Priority[];
  openModal: (priority: Priority | null) => void;
  updateData: () => void;
};

export default function ManagePrioritiesTable({ priorities, openModal, updateData }: Prop) {
  const columnHelper = createColumnHelper<Priority>();
  const columns = [
    columnHelper.accessor('priorityName', {
      cell: (info) => info.getValue(),
      header: 'Priority Name',
    }),
    columnHelper.accessor('priorityIndex', {
      cell: (info) => info.getValue(),
      header: 'Priority Index',
    }),
    columnHelper.accessor('deadlineHours', {
      cell: (info) => `${info.getValue()} hours`,
      header: 'Deadline Hours',
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
    data: priorities,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const prioritiesService = new PriorityService(user.accessToken);

  const onDelete = async (priority: Priority) => {
    const message = `Are you sure you want to delete <b>${priority.priorityName}</b>?`;
    if (await confirm(message)) {
      await toast.promise(prioritiesService.delete(priority.id), {
        loading: 'Deleting priority...',
        success: (r) => {
          // setPrioritiesVal(priorities.filter((cat) => cat.id !== priority.id));

          updateData();

          return 'Sucesfully deleted the selected priority';
        },
        error: (e) => e.toString(),
      });
    }
  };

  return <GeneralTable table={table} />;
}
