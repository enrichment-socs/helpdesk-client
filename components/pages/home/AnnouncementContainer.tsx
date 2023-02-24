import { Announcement } from '../../../models/Announcement';
import { GlobeIcon, SpeakerphoneIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';
import { Dispatch, useState } from 'react';
import { SetStateAction, useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../../models/SessionUser';
import { ROLES } from '../../../shared/constants/roles';
import CustomPaginator from '../../../widgets/CustomPaginator';
import { ClientPromiseWrapper } from '../../../shared/libs/client-promise-wrapper';
import toast from 'react-hot-toast';
import { AnnouncementService } from '../../../services/AnnouncementService';
import { activeSemesterAtom } from '../../../atom';
import IndexStore from '../../../stores';

type Props = {
  setOpenAnnouncementModal: Dispatch<SetStateAction<boolean>>;
  setOpenAnnouncement: Dispatch<SetStateAction<Announcement>>;
  initialTake: number;
};

export default function AnnouncementContainer({
  setOpenAnnouncement,
  setOpenAnnouncementModal,
  initialTake,
}: Props) {
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const announcementService = new AnnouncementService(user.accessToken);
  const [activeSemester] = useAtom(activeSemesterAtom);
  const [take, setTake] = useState(initialTake);
  const [skip, setSkip] = useAtom(IndexStore.announcementsSkip);
  const [count, setCount] = useAtom(IndexStore.announcementsCount);
  const [pageNumber, setPageNumber] = useState(1);
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const [announcements, setAnnouncements] = useAtom(IndexStore.announcements);

  const fetchAnnouncements = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);
    const { announcements } = await wrapper.handle(
      announcementService.getBySemester(activeSemester.id, true, take, skip)
    );
    return announcements;
  };

  const onAnnouncementClick = (ann: Announcement) => {
    setOpenAnnouncement(ann);
    setOpenAnnouncementModal(true);
  };

  return (
    <div className={`relative mx-2 p-2 border-2 md:w-3/4 min-h-[32rem] rounded`}>
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

      <div className="absolute inset-x-0 bottom-0">
        <CustomPaginator
          take={take}
          skip={skip}
          totalCount={count}
          setSkip={setSkip}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          threeFirstPageNumbers={threeFirstPageNumber}
          setThreeFirstPageNumbers={setThreeFirstPageNumber}
          fetchItem={fetchAnnouncements}
          setItem={setAnnouncements}
          isDisplayCount={false}
          isDisplayBorderTop={false}
        />
      </div>
    </div>
  );
}
