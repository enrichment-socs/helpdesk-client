import { ChartBarIcon } from '@heroicons/react/solid';
import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Layout from '../widgets/_Layout';
import { getInitialServerProps } from '../shared/libs/initialize-server-props';
import { withSessionSsr } from '../shared/libs/session';
import { SemestersService } from '../services/SemestersService';
import { AnnouncementsService } from '../services/AnnouncementService';
import { Announcement } from '../models/Announcement';
import AnnouncementContainer from '../components/pages/home/AnnouncementContainer';
import AnnouncementDetailModal from '../components/announcements/AnnouncementDetailModal';
import { useState } from 'react';
import { SessionUser } from '../models/SessionUser';
import { GraphApiService } from '../services/GraphApiService';
import { Message } from '../models/Message';
import { ROLES } from '../shared/constants/roles';
import { useHydrateAtoms } from 'jotai/utils';
import { atom } from 'jotai';
import MessageContainer from '../components/messages/MessageContainer';
import AdminRequestSummaryContainer from '../components/request-summaries/admin/AdminRequestSummaryContainer';
import UserRequestSummaryContainer from '../components/request-summaries/user/UserRequestSummaryContainer';

type Props = {
  announcements: Announcement[];
  messages: Message[] | [];
  initialTake: number;
  initialSkip: number;
  messageCount: number;
};

export const messagesAtom = atom([] as Message[]);

const Home: NextPage<Props> = ({
  announcements,
  messages: serverMessages,
  initialTake,
  initialSkip,
  messageCount,
}) => {
  useHydrateAtoms([[messagesAtom, serverMessages]] as const);

  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);
  const [openAnnouncement, setOpenAnnouncement] = useState<Announcement>(null);

  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const [skipMessageCount, setSkipMessageCount] = useState(initialSkip);

  console.log(user);

  return (
    <Layout>
      <AnnouncementDetailModal
        announcement={openAnnouncement}
        isOpen={openAnnouncementModal}
        setIsOpen={setOpenAnnouncementModal}
      />

      <div>
        <div>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <AnnouncementContainer
              setOpenAnnouncement={setOpenAnnouncement}
              setOpenAnnouncementModal={setOpenAnnouncementModal}
              announcements={announcements}
            />

            {user.roleName === ROLES.ADMIN ? (
              <AdminRequestSummaryContainer />
            ) : user.roleName === ROLES.USER ? (
              <UserRequestSummaryContainer />
            ) : null}
          </div>
        </div>

        {user.roleName !== ROLES.USER && (
          <MessageContainer
            take={initialTake}
            skip={skipMessageCount}
            setSkip={setSkipMessageCount}
            totalCount={messageCount}
          />
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemestersService());

    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    const user = session.user as SessionUser;
    const announcementService = new AnnouncementsService(user.accessToken);
    const graphApiService = new GraphApiService(user.accessToken);

    const announcements = await announcementService.getBySemester(
      sessionActiveSemester.id
    );

    const initialTake = 10;
    const initialSkip = 0;
    const { messages, count } =
      user.roleName === ROLES.USER
        ? { messages: [], count: 0 }
        : await graphApiService.getMessages(initialTake, initialSkip);

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        announcements,
        messages,
        messageCount: count,
        initialTake,
        initialSkip,
      },
    };
  }
);

export default Home;
