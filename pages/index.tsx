import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Layout from '../widgets/_Layout';
import { getInitialServerProps } from '../shared/libs/initialize-server-props';
import { withSessionSsr } from '../shared/libs/session';
import { AnnouncementService } from '../services/AnnouncementService';
import { Announcement } from '../models/Announcement';
import AnnouncementContainer from '../components/pages/home/AnnouncementContainer';
import AnnouncementDetailModal from '../components/announcements/AnnouncementDetailModal';
import { useState } from 'react';
import { SessionUser } from '../models/SessionUser';
import { Message } from '../models/Message';
import { ROLES } from '../shared/constants/roles';
import { useHydrateAtoms } from 'jotai/utils';
import AdminTicketSummaryContainer from '../components/ticket-summaries/admin/AdminTicketSummaryContainer';
import UserTicketSummaryContainer from '../components/ticket-summaries/user/UserTicketSummaryContainer';
import { MessageService } from '../services/MessageService';
import { GuidelineCategoryService } from '../services/GuidelineCategoryService';
import { GuidelineCategory } from '../models/GuidelineCategory';
import { TicketService } from '../services/TicketService';
import { TicketSummary } from '../models/TicketSummary';
import IndexStore from '../stores';
import { ReportService } from '../services/ReportService';
import { TicketCountByCategory } from '../models/reports/TicketCountByCategoryt';
import dynamic from 'next/dynamic';
import { TicketCountByPriority } from '../models/reports/TicketCountByPriority';
import { TicketCountByStatus } from '../models/reports/TicketCountByStatus';

const MessageContainer = dynamic(
  () => import('../components/messages/MessageContainer')
);
const GuidelineContainer = dynamic(
  () => import('../components/guidelines/GuidelineContainer')
);
const ReportDashboard = dynamic(
  () => import('../components/report-dashboard/ReportDashboard')
);

type Props = {
  announcements: Announcement[];
  faqCategories: GuidelineCategory[];
  messages: Message[] | [];
  initialTake: number;
  initialSkip: number;
  messageCount: number;
  ticketSummary: TicketSummary;
  reports: {
    ticketsCountByCategories: TicketCountByCategory[];
    ticketsCountByPriorities: TicketCountByPriority[];
    ticketsCountByStatuses: TicketCountByStatus[];
  };
};

const Home: NextPage<Props> = ({
  announcements,
  faqCategories,
  messages,
  initialTake,
  initialSkip,
  messageCount,
  ticketSummary,
  reports,
}) => {
  useHydrateAtoms([
    [IndexStore.messages, messages],
    [IndexStore.skipCount, initialSkip],
    [IndexStore.totalMessagesCount, messageCount],
    [IndexStore.ticketsCountByCategories, reports.ticketsCountByCategories],
    [IndexStore.ticketsCountByPriorities, reports.ticketsCountByPriorities],
    [IndexStore.ticketsCountByStatuses, reports.ticketsCountByStatuses],
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

        {user?.roleName === ROLES.SUPER_ADMIN && <ReportDashboard />}

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
    const { session, sessionActiveSemester, ...globalProps } =
      await getInitialServerProps(req);

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
    const reportService = new ReportService(user.accessToken);

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

    const ticketsCountByCategories =
      user.roleName === ROLES.SUPER_ADMIN
        ? await reportService.getTicketsCountByCategories()
        : [];

    const ticketsCountByPriorities =
      user.roleName === ROLES.SUPER_ADMIN
        ? await reportService.getTicketsCountByPriorities()
        : [];

    const ticketsCountByStatuses =
      user.roleName === ROLES.SUPER_ADMIN
        ? await reportService.getTicketsCountByStatuses()
        : [];

    return {
      props: {
        ...globalProps,
        session,
        sessionActiveSemester,
        announcements,
        faqCategories,
        messages,
        messageCount: count,
        initialTake,
        initialSkip,
        ticketSummary,
        reports: {
          ticketsCountByCategories,
          ticketsCountByPriorities,
          ticketsCountByStatuses,
        },
      },
    };
  }
);

export default Home;
