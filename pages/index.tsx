import { ChartBarIcon } from '@heroicons/react/solid';
import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Layout from '../widgets/_Layout';
import { getInitialServerProps } from '../shared/libs/initialize-server-props';
import { withSessionSsr } from '../shared/libs/session';
import { SemesterService } from '../services/SemesterService';
import { AnnouncementService } from '../services/AnnouncementService';
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
import AdminTicketSummaryContainer from '../components/ticket-summaries/admin/AdminTicketSummaryContainer';
import UserTicketSummaryContainer from '../components/ticket-summaries/user/UserTicketSummaryContainer';
import { MessageService } from '../services/MessageService';
import FAQContainer from '../components/faqs/FAQContainer';
import { FAQCategoryService } from '../services/FAQCategoryService';
import { FAQCategory } from '../models/FAQCategory';

type Props = {
  announcements: Announcement[];
  faqCategories: FAQCategory[];
  messages: Message[] | [];
  initialTake: number;
  initialSkip: number;
  messageCount: number;
};

export const messagesAtom = atom([] as Message[]);

const Home: NextPage<Props> = ({
  announcements,
  faqCategories,
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
              <AdminTicketSummaryContainer />
            ) : user.roleName === ROLES.USER ? (
              <UserTicketSummaryContainer />
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

        {user.roleName === ROLES.USER && (
          <FAQContainer faqCategories={faqCategories} />
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemesterService());

    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    const user = session.user as SessionUser;
    const announcementService = new AnnouncementService(user.accessToken);
    const graphApiService = new GraphApiService(user.accessToken);
    const messageService = new MessageService(user.accessToken);

    const announcements = await announcementService.getBySemester(
      sessionActiveSemester.id
    );

    const initialTake = 10;
    const initialSkip = 0;
    const { messages, count } =
      user.roleName === ROLES.USER
        ? { messages: [], count: 0 }
        : await messageService.getMessages(initialTake, initialSkip);

    let faqCategories = null;
    if (user.roleName === ROLES.USER) {
      const faqCategoryService = new FAQCategoryService(user?.accessToken);
      faqCategories = await faqCategoryService.getAll();
    }

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        announcements,
        faqCategories,
        messages,
        messageCount: count,
        initialTake,
        initialSkip,
      },
    };
  }
);

export default Home;
