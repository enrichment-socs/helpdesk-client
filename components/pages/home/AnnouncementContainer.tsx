import { Announcement } from '../../../models/Announcement';
import { GlobeIcon, SpeakerphoneIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';

type Props = {
  announcements: Announcement[];
};

export default function AnnouncementContainer({ announcements }: Props) {
  return (
    <div className='mx-2 p-2 border-2 md:w-3/4 rounded divide-y'>
      <div className='text-lg font-bold mb-3 flex items-center'>
        <SpeakerphoneIcon className='h-5 w-5' />
        <span className='ml-3'>Announcement</span>
      </div>

      {/* Announcement Content */}
      {announcements.length == 0 && (
        <div className='py-4 md:pb-0 md:pt-24 text-center'>
          There is currently no announcement
        </div>
      )}

      {announcements.map((announcement) => (
        <div
          className='p-3 hover:bg-gray-50 rounded cursor-pointer'
          key={announcement.id}>
          <div className='font-semibold'>{announcement.title}</div>
          <div className='mt-1 flex divide-x'>
            <div className='pr-3 flex flex-col justify-center items-center text-center md:flex-row'>
              <span className='text-slate-600'>From :</span>
              <span className='md:ml-2 font-medium'>
                {format(new Date(announcement.startDate), 'yyyy-MM-dd HH:mm')}
              </span>
            </div>
            <div className='px-3 flex flex-col justify-center items-center text-center md:flex-row'>
              <span className='text-slate-600'>To :</span>
              <span className='md:ml-2 font-medium'>
                {format(new Date(announcement.endDate), 'yyyy-MM-dd HH:mm')}
              </span>
            </div>
            <div className='px-3 flex flex-col justify-center items-center text-center md:flex-row'>
              <GlobeIcon className='h-5 w-5' />
              <span className='text-slate-600 md:ml-1'>Public</span>
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