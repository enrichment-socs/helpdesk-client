import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { activeSemesterAtom } from '../../atom';
import { Announcement } from '../../models/Announcement';
import { Role } from '../../models/Role';
import { SessionUser } from '../../models/SessionUser';
import { AnnouncementService } from '../../services/AnnouncementService';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import ManageAnnouncementStore from '../../stores/manage/announcements';
import CustomPaginator from '../../widgets/CustomPaginator';
import AnnouncementFormModal from './AnnouncementFormModal';
import ManageAnnouncementsTable from './ManageAnnouncementsTable';

type Props = {
  roles: Role[];
};

export default function ManageAnnouncementsContainer({ roles }: Props) {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const session = useSession();
  const user = session.data.user as SessionUser;
  const announcementService = new AnnouncementService(user.accessToken);
  const [activeSemester] = useAtom(activeSemesterAtom);
  const [announcements, setAnnouncements] = useAtom(
    ManageAnnouncementStore.announcements
  );
  const [pageNumber, setPageNumber] = useAtom(
    ManageAnnouncementStore.pageNumber
  );
  const [take, setTake] = useAtom(ManageAnnouncementStore.take);
  const [skip, setSkip] = useAtom(ManageAnnouncementStore.skip);
  const [count, setCount] = useAtom(ManageAnnouncementStore.count);

  const getAnnouncementsBySemester = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);

    return wrapper.handle(
      announcementService.getBySemester(activeSemester.id, false, take, skip)
    );
  };

  const fetchAnnouncements = async (take: number, skip: number) => {
    const { announcements } = await getAnnouncementsBySemester(take, skip);
    return announcements;
  };

  const openModal = (announcement: Announcement | null) => {
    setSelectedAnnouncement(announcement);
    setOpenFormModal(true);
  };

  const updateAnnouncementsData = async () => {
    let count = 0,
      announcements = [];

    ({ count, announcements } = await getAnnouncementsBySemester(take, skip));

    if (announcements.length === 0 && count > 0 && pageNumber > 1) {
      let newSkip = skip - take;

      ({ count, announcements } = await getAnnouncementsBySemester(
        take,
        newSkip
      ));

      setPageNumber((prev) => prev - 1);
      setSkip(newSkip);
    }

    setCount(count);
    setAnnouncements(announcements);
  };

  return (
    <>
      <AnnouncementFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        announcement={selectedAnnouncement}
        roles={roles}
        updateData={updateAnnouncementsData}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Announcements</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none">
          Create
        </button>
      </div>
      <ManageAnnouncementsTable
        openModal={openModal}
        updateData={updateAnnouncementsData}
      />

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
      />
    </>
  );
}
