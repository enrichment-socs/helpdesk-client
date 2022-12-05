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
import { TicketCountByCategory } from '../models/reports/TicketCountByCategory';
import dynamic from 'next/dynamic';
import { TicketCountByPriority } from '../models/reports/TicketCountByPriority';
import { TicketCountByStatus } from '../models/reports/TicketCountByStatus';
import { TicketCountByHandler } from '../models/reports/TicketCountByHandler';
import { UserService } from '../services/UserService';
import { TicketCountByMonth } from '../models/reports/TicketCountByMonth';
import SpecificHandlerReportDashboard from '../components/report-dashboard/SpecificHandlerReportDashboard';
import { User } from '../models/User';

const MessageContainer = dynamic(
  () => import('../components/messages/MessageContainer')
);
const GuidelineContainer = dynamic(
  () => import('../components/guidelines/GuidelineContainer')
);
const GeneralReportDashboard = dynamic(
  () => import('../components/report-dashboard/GeneralReportDashboard')
);

type Props = {
  announcements: Announcement[];
  faqCategories: GuidelineCategory[];
  messages: Message[] | [];
  initialTake: number;
  initialSkip: number;
  messageCount: number;
  ticketSummary: TicketSummary;
  admins: User[];
  reports: {
    ticketsCountByCategories: TicketCountByCategory[];
    ticketsCountByPriorities: TicketCountByPriority[];
    ticketsCountByStatuses: TicketCountByStatus[];
    ticketsCountByHandlers: TicketCountByHandler[];
    ticketsCountByMonths: TicketCountByMonth[];
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
  admins,
  reports,
}) => {
  useHydrateAtoms([
    [IndexStore.messages, messages],
    [IndexStore.skipCount, initialSkip],
    [IndexStore.totalMessagesCount, messageCount],
    [IndexStore.ticketsCountByCategories, reports.ticketsCountByCategories],
    [IndexStore.ticketsCountByPriorities, reports.ticketsCountByPriorities],
    [IndexStore.ticketsCountByStatuses, reports.ticketsCountByStatuses],
    [IndexStore.ticketsCountByHandlers, reports.ticketsCountByHandlers],
    [IndexStore.ticketsCountByMonths, reports.ticketsCountByMonths],
    [IndexStore.admins, admins],
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

      {user.roleName !== ROLES.SUPER_ADMIN && (
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
      )}

      <div>
        {user?.roleName === ROLES.SUPER_ADMIN && (
          <>
            <GeneralReportDashboard />
            <SpecificHandlerReportDashboard />
          </>
        )}

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
    const guidelineCatSvc = new GuidelineCategoryService(user?.accessToken);
    const userService = new UserService(user?.accessToken);

    const announcements =
      user.roleName !== ROLES.SUPER_ADMIN
        ? await announcementService.getBySemester(
            sessionActiveSemester.id,
            true
          )
        : [];

    const initialTake = 10;
    const initialSkip = 0;
    const { messages, count } =
      user?.roleName !== ROLES.ADMIN
        ? { messages: [], count: 0 }
        : await messageService.getMessages(initialTake, initialSkip);

    let faqCategories = null;
    if (user?.roleName === ROLES.USER) {
      faqCategories = await guidelineCatSvc.getAll();
    }

    const ticketSummary =
      user.roleName !== ROLES.SUPER_ADMIN
        ? await ticketService.getTicketSummary(sessionActiveSemester.id)
        : null;

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

    const ticketsCountByHandlers =
      user.roleName === ROLES.SUPER_ADMIN
        ? await reportService.getTicketsCountByHandlers()
        : [];

    const admins =
      user.roleName === ROLES.SUPER_ADMIN
        ? await userService.getUsersWithAdminRole()
        : [];

    const ticketsCountByMonths =
      user.roleName === ROLES.SUPER_ADMIN
        ? await reportService.getTicketsCountByMonths()
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
        admins,
        reports: {
          ticketsCountByCategories,
          ticketsCountByPriorities,
          ticketsCountByStatuses,
          ticketsCountByHandlers,
          ticketsCountByMonths,
        },
      },
    };
  }
);

export default Home;
