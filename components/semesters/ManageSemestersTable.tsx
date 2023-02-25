import { confirm } from '../../shared/libs/confirm-dialog-helper';
import { Semester } from '../../models/Semester';
import { SemesterService } from '../../services/SemesterService';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../models/SessionUser';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import GeneralTable from '../GeneralTable';
import ManageSemesterStore from '../../stores/manage/semesters';

type Props = {
  openModal: (semester: Semester | null) => void;
  updateData: () => void;
};

export default function ManageSemestersTable({ openModal, updateData }: Props) {
  const [semesters, setSemesters] = useAtom(ManageSemesterStore.semesters);
  const columnHelper = createColumnHelper<Semester>();
  const columns = [
    columnHelper.accessor('type', {
      cell: (info) => info.getValue(),
      header: 'type',
    }),
    columnHelper.accessor('startYear', {
      cell: (info) => info.getValue(),
      header: 'Start Year',
    }),
    columnHelper.accessor('endYear', {
      cell: (info) => info.getValue(),
      header: 'End Year',
    }),
    columnHelper.accessor('isActive', {
      cell: (info) => (
        <span
          className={`${
            info.getValue()
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          } inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
      header: 'Status',
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
    data: semesters,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const semestersService = new SemesterService(user.accessToken);

  const onDelete = async (semester: Semester) => {
    const message = `Are you sure you want to delete <b>${semester.type} Semester ${semester.startYear}/${semester.endYear}</b> ?`;
    if (await confirm(message)) {
      await toast.promise(semestersService.deleteSemester(semester.id), {
        loading: 'Deleting semester...',
        success: (r) => {
          // setSemesters(semesters.filter((s) => s.id !== semester.id));

          updateData();

          return 'Sucesfully deleted the selected semester';
        },
        error: (e) => e.toString(),
      });
    }
  };

  return <GeneralTable table={table} />;
}
