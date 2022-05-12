import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import AnnouncementFormModal from '../../../components/announcements/AnnouncementFormModal';
import ManageAnnouncementsTable from '../../../components/announcements/ManageAnnouncementsTable';
import Layout from '../../../widgets/_Layout';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { Announcement } from '../../../models/Announcement';
import { AnnouncementsService } from '../../../services/AnnouncementService';
import { SemestersService } from '../../../services/SemestersService';
import { SessionUser } from '../../../models/SessionUser';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';

export const announcementsAtom = atom([] as Announcement[]);

type Props = {
  currAnnouncements: Announcement[];
};

const ManageRolesPage: NextPage<Props> = ({ currAnnouncements }) => {
  useHydrateAtoms([[announcementsAtom, currAnnouncements]] as const);
  const [announcements, setAnnouncement] = useAtom(announcementsAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  useEffect(() => {
    setAnnouncement(currAnnouncements);
  }, [currAnnouncements, setAnnouncement]);

  const openModal = (announcement: Announcement | null) => {
    setSelectedAnnouncement(announcement);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <AnnouncementFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        announcement={selectedAnnouncement}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Announcements</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create
        </button>
      </div>
      <ManageAnnouncementsTable
        announcements={announcements}
        openModal={openModal}
      />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemestersService());

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.SUPER_ADMIN])) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const user = session.user as SessionUser;
    const announcementService = new AnnouncementsService(user.accessToken);

    const currAnnouncements = await announcementService.getBySemester(
      sessionActiveSemester.id
    );

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        currAnnouncements,
      },
    };
  }
);

export default ManageRolesPage;
