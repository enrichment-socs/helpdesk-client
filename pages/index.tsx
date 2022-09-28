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
import { Message } from '../models/Message';
import { ROLES } from '../shared/constants/roles';
import { useHydrateAtoms } from 'jotai/utils';
import { atom } from 'jotai';
import MessageContainer from '../components/messages/MessageContainer';
import AdminTicketSummaryContainer from '../components/ticket-summaries/admin/AdminTicketSummaryContainer';
import UserTicketSummaryContainer from '../components/ticket-summaries/user/UserTicketSummaryContainer';
import { MessageService } from '../services/MessageService';
import GuidelineContainer from '../components/guidelines/GuidelineContainer';
import { GuidelineCategoryService } from '../services/GuidelineCategoryService';
import { GuidelineCategory } from '../models/GuidelineCategory';
import { TicketService } from '../services/TicketService';
import { TicketSummary } from '../models/TicketSummary';
import IndexStore from '../stores';

type Props = {
  announcements: Announcement[];
  faqCategories: GuidelineCategory[];
  messages: Message[] | [];
  initialTake: number;
  initialSkip: number;
  messageCount: number;
  ticketSummary: TicketSummary;
};

export const messagesAtom = atom([] as Message[]);

const Home: NextPage<Props> = ({
  announcements,
  faqCategories,
  messages,
  initialTake,
  initialSkip,
  messageCount,
  ticketSummary,
}) => {
  useHydrateAtoms([
    [IndexStore.messages, messages],
    [IndexStore.skipCount, initialSkip],
    [IndexStore.totalMessagesCount, messageCount],
  ] as const);

  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);
  const [openAnnouncement, setOpenAnnouncement] = useState<Announcement>(null);

  const session = useSession();
  const user = session?.data?.user as SessionUser;

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

            {user?.roleName === ROLES.USER ? (
              <UserTicketSummaryContainer ticketSummary={ticketSummary} />
            ) : (
              <AdminTicketSummaryContainer ticketSummary={ticketSummary} />
            )}
          </div>
        </div>

        {user?.roleName === ROLES.ADMIN && (
          <MessageContainer take={initialTake} />
        )}

        {user?.roleName === ROLES.USER && (
          <GuidelineContainer guidelineCategories={faqCategories} />
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
    const messageService = new MessageService(user.accessToken);
    const ticketService = new TicketService(user.accessToken);

    const announcements = await announcementService.getBySemester(
      sessionActiveSemester.id,
      true
    );

    const initialTake = 10;
    const initialSkip = 0;
    const { messages, count } =
      user?.roleName === ROLES.USER
        ? { messages: [], count: 0 }
        : await messageService.getMessages(initialTake, initialSkip);

    let faqCategories = null;
    if (user?.roleName === ROLES.USER) {
      const faqCategoryService = new GuidelineCategoryService(
        user?.accessToken
      );
      faqCategories = await faqCategoryService.getAll();
    }

    const ticketSummary = await ticketService.getTicketSummary(
      sessionActiveSemester.id
    );

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
        ticketSummary,
      },
    };
  }
);

export default Home;
