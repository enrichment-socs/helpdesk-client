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
import { AnnouncementService } from '../../../services/AnnouncementService';
import { SemesterService } from '../../../services/SemesterService';
import { SessionUser } from '../../../models/SessionUser';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { RoleService } from '../../../services/RoleService';
import { Role } from '../../../models/Role';
import ManageAnnouncementStore from '../../../stores/manage/announcements';

type Props = {
  currAnnouncements: Announcement[];
  roles: Role[];
};

const ManageRolesPage: NextPage<Props> = ({ currAnnouncements, roles }) => {
  useHydrateAtoms([
    [ManageAnnouncementStore.announcements, currAnnouncements],
  ] as const);
  const [announcements, setAnnouncement] = useAtom(
    ManageAnnouncementStore.announcements
  );
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
        roles={roles}
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
      <ManageAnnouncementsTable openModal={openModal} />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, sessionActiveSemester, ...globalProps } =
      await getInitialServerProps(req);

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.SUPER_ADMIN])) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const user = session.user as SessionUser;
    const announcementService = new AnnouncementService(user.accessToken);
    const roleService = new RoleService(user.accessToken);

    const currAnnouncements = await announcementService.getBySemester(
      sessionActiveSemester.id
    );

    const roles = await roleService.getAll();

    return {
      props: {
        ...globalProps,
        session,
        sessionActiveSemester,
        currAnnouncements,
        roles,
      },
    };
  }
);

export default ManageRolesPage;
