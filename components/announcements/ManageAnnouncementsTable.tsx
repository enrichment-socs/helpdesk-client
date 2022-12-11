import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { confirm } from '../../shared/libs/confirm-dialog-helper';
import { Announcement } from '../../models/Announcement';
import { AnnouncementService } from '../../services/AnnouncementService';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../models/SessionUser';
import ManageAnnouncementStore from '../../stores/manage/announcements';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import GeneralTable from '../GeneralTable';

type Props = {
  openModal: (announcement: Announcement | null) => void;
};

export default function ManageAnnouncementsTable({ openModal }: Props) {
  const [announcements, setAnnouncements] = useAtom(
    ManageAnnouncementStore.announcements
  );

  const columnHelper = createColumnHelper<Announcement>();
  const columns = [
    columnHelper.accessor('title', {
      cell: (info) => info.getValue(),
      header: 'Title',
    }),
    columnHelper.accessor('role', {
      cell: (info) => {
        const role = info.row.original.role;
        return role ? role.roleName : 'All';
      },
      header: 'Target Role',
    }),
    columnHelper.accessor('startDate', {
      cell: (info) => (
        <>{format(new Date(info.getValue()), 'yyyy-MM-dd HH:mm')}</>
      ),
      header: 'Start Date',
    }),
    columnHelper.accessor('endDate', {
      cell: (info) => (
        <>{format(new Date(info.getValue()), 'yyyy-MM-dd HH:mm')}</>
      ),
      header: 'End Date',
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
    data: announcements,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const onDelete = async (announcement: Announcement) => {
    const message = `Are you sure you want to delete <b>${announcement.title} </b> ?`;
    if (await confirm(message)) {
      const announcementService = new AnnouncementService(user.accessToken);
      await toast.promise(
        announcementService.deleteAnnouncement(announcement.id),
        {
          loading: 'Deleting announcement...',
          success: (r) => {
            setAnnouncements(
              announcements.filter((a) => a.id !== announcement.id)
            );
            return 'Sucesfully deleted the selected announcement';
          },
          error: (e) => e.toString(),
        }
      );
    }
  };

  return <GeneralTable table={table} />;
}
