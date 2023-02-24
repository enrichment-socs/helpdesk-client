import { useAtom, useSetAtom } from 'jotai';
import { NextPage } from 'next';
import Layout from '../../../widgets/_Layout';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { Announcement } from '../../../models/Announcement';
import { AnnouncementService } from '../../../services/AnnouncementService';
import { SessionUser } from '../../../models/SessionUser';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { RoleService } from '../../../services/RoleService';
import { Role } from '../../../models/Role';
import ManageAnnouncementStore from '../../../stores/manage/announcements';
import ManageAnnouncementsContainer from '../../../components/announcements/ManageAnnouncementsContainer';
import useHydrateAndSyncAtom from '../../../hooks/useHydrateAndSyncAtom';

type Props = {
  currAnnouncements: Announcement[];
  roles: Role[];
  count: number;
  initialTake: number;
  initialSkip: number;
};

const ManageAnnouncementsPage: NextPage<Props> = ({
  currAnnouncements,
  roles,
  count,
  initialTake,
  initialSkip
}) => {
  useHydrateAndSyncAtom([
    [ManageAnnouncementStore.announcements, useSetAtom(ManageAnnouncementStore.announcements), currAnnouncements],
    [ManageAnnouncementStore.take, useSetAtom(ManageAnnouncementStore.take), initialTake],
    [ManageAnnouncementStore.skip, useSetAtom(ManageAnnouncementStore.skip), initialSkip],
    [ManageAnnouncementStore.count, useSetAtom(ManageAnnouncementStore.count), count],
  ]);

  const [announcements, setAnnouncements] = useAtom(
    ManageAnnouncementStore.announcements
  );

  // useEffect(() => {
  //   setAnnouncements(currAnnouncements);
  // }, [currAnnouncements, setAnnouncements]);

  return (
    <Layout>
      <ManageAnnouncementsContainer 
        roles={roles}
      />
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

    const initialTake = 1;
    const initialSkip = 0;

    const {count, announcements:currAnnouncements} = await announcementService.getBySemester(
      sessionActiveSemester.id,
      false,
      initialTake,
      initialSkip
    );

    const roles = await roleService.getAll();

    return {
      props: {
        ...globalProps,
        session,
        sessionActiveSemester,
        currAnnouncements,
        roles,
        initialTake,
        initialSkip,
        count,
      },
    };
  }
);

export default ManageAnnouncementsPage;
