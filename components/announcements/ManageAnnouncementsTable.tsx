import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { confirm } from '../../lib/confirm-dialog-helper';
import { Announcement } from '../../models/Announcement';
import { announcementsAtom } from '../../pages/manage/announcements';
import { AnnouncementsService } from '../../services/AnnouncementService';
import { format } from 'date-fns';

type Props = {
  announcements: Announcement[];
  openModal: (announcement: Announcement | null) => void;
};

export default function ManageAnnouncementsTable({
  announcements,
  openModal,
}: Props) {
  const [, setAnnouncements] = useAtom(announcementsAtom);

  const onDelete = async (announcement: Announcement) => {
    const message = `Are you sure you want to delete <b>${announcement.title} </b> ?`;
    if (await confirm(message)) {
      await toast.promise(
        AnnouncementsService.deleteAnnouncement(announcement.id),
        {
          loading: 'Deleting announcement...',
          success: (r) => {
            setAnnouncements(
              announcements.filter((a) => a.id !== announcement.id),
            );
            return 'Sucesfully deleted the selected announcement';
          },
          error: (e) => e.toString(),
        },
      );
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-primary'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                    Announcement Title
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                    Start Date
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                    End Date
                  </th>
                  <th scope='col' className='relative px-6 py-3'>
                    <span className='sr-only'>Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {announcements.length == 0 && (
                  <tr>
                    <td colSpan={4} className='text-center p-4'>
                      No Announcement
                    </td>
                  </tr>
                )}
                {announcements &&
                  announcements.map((announcement, idx) => (
                    <tr
                      key={announcement.id}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {announcement.title}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {format(
                          new Date(announcement.startDate),
                          'yyyy-MM-dd HH:mm',
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {format(
                          new Date(announcement.endDate),
                          'yyyy-MM-dd HH:mm',
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1'>
                        <button
                          type='button'
                          onClick={() => openModal(announcement)}
                          className='inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                          Update
                        </button>
                        <button
                          type='button'
                          onClick={() => onDelete(announcement)}
                          className='inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
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
