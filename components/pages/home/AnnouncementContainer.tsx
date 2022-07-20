import { Announcement } from '../../../models/Announcement';
import { GlobeIcon, SpeakerphoneIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';
import { Dispatch } from 'react';
import { SetStateAction } from 'jotai';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../../models/SessionUser';
import { ROLES } from '../../../shared/constants/roles';

type Props = {
  announcements: Announcement[];
  setOpenAnnouncementModal: Dispatch<SetStateAction<boolean>>;
  setOpenAnnouncement: Dispatch<SetStateAction<Announcement>>;
};

export default function AnnouncementContainer({
  announcements,
  setOpenAnnouncement,
  setOpenAnnouncementModal,
}: Props) {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const onAnnouncementClick = (ann: Announcement) => {
    setOpenAnnouncement(ann);
    setOpenAnnouncementModal(true);
  };

  return (
    <div className={`mx-2 p-2 border-2 md:w-3/4 min-h-[24rem] rounded`}>
      <div className="text-lg font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <SpeakerphoneIcon className="h-5 w-5" />
        <span className="ml-3">Announcement</span>
      </div>

      {/* Announcement Content */}
      {announcements.length == 0 && (
        <div className="border-box py-4 flex h-5/6 items-center justify-center text-center">
          There is currently no announcement
        </div>
      )}

      {announcements.map((announcement) => (
        <div
          onClick={() => onAnnouncementClick(announcement)}
          className="p-3 hover:bg-gray-50 rounded cursor-pointer border-b border-gray-200 pb-6"
          key={announcement.id}>
          <div className="font-semibold">{announcement.title}</div>
          <div className="mt-1 flex divide-x">
            <div className="text-sm md:text-base pr-3 flex flex-col justify-center items-center text-center md:flex-row">
              <span className="text-slate-600">From :</span>
              <span className="md:ml-2 font-medium">
                {format(new Date(announcement.startDate), 'yyyy-MM-dd HH:mm')}
              </span>
            </div>
            <div className="text-sm md:text-base px-3 flex flex-col justify-center items-center text-center md:flex-row">
              <span className="text-slate-600">To :</span>
              <span className="md:ml-2 font-medium">
                {format(new Date(announcement.endDate), 'yyyy-MM-dd HH:mm')}
              </span>
            </div>
            <div className="px-3 flex flex-col justify-center items-center text-center md:flex-row">
              <GlobeIcon className="h-5 w-5" />
              <span className="text-slate-600 md:ml-1">Public</span>
            </div>
            {/* 
            <div className='px-3 flex flex-col justify-center items-center text-center md:flex-row'>
              <span className='text-slate-600'>Priority:</span>
              <span className='md:ml-2 font-medium'>-</span>
            </div>
            <div className='px-3 flex flex-col justify-center items-center text-center md:flex-row'>
              <span className='text-slate-600'>Announcement Type: </span>
              <span className='md: ml-2 font-medium'>-</span>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
}
