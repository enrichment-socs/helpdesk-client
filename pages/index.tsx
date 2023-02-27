import type { InferGetServerSidePropsType, NextPage } from 'next';
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
import { ROLES } from '../shared/constants/roles';
import { useHydrateAtoms } from 'jotai/utils';
import AdminTicketSummaryContainer from '../components/ticket-summaries/admin/AdminTicketSummaryContainer';
import UserTicketSummaryContainer from '../components/ticket-summaries/user/UserTicketSummaryContainer';
import { MessageService } from '../services/MessageService';
import { GuidelineCategoryService } from '../services/GuidelineCategoryService';
import { TicketService } from '../services/TicketService';
import IndexStore from '../stores';
import { ReportService } from '../services/ReportService';
import dynamic from 'next/dynamic';
import { UserService } from '../services/UserService';
import { guidelineCategoriesAtom } from '../atom';

const MessageContainer = dynamic(
  () => import('../components/messages/MessageContainer')
);
const UnmarkedMessageContainer = dynamic(
  () => import('../components/messages/UnmarkedMessageContainer')
);
const GuidelineContainer = dynamic(
  () => import('../components/guidelines/GuidelineContainer')
);
const ReportDashboard = dynamic(
  () => import('../components/report-dashboard/ReportDashboard')
);

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({
  announcement,
  guidelineCategories,
  markedMessage,
  ticketSummary,
  admins,
  reports,
  unmarkedMessage,
}) => {
  useHydrateAtoms([
    [IndexStore.messages, markedMessage.messages],
    [IndexStore.skipCount, markedMessage.initialSkip],
    [IndexStore.totalMessagesCount, markedMessage.messageCount],

    [IndexStore.unmarkedMessages, unmarkedMessage.messages],
    [IndexStore.unmarkedSkipCount, unmarkedMessage.initialSkip],
    [IndexStore.unmarkedMessagesCount, unmarkedMessage.messageCount],

    [IndexStore.announcements, announcement.announcements],
    [IndexStore.announcementsSkip, announcement.initialSkip],
    [IndexStore.announcementsCount, announcement.count],

    [IndexStore.ticketsCountByCategories, reports.ticketsCountByCategories],
    [IndexStore.ticketsCountByPriorities, reports.ticketsCountByPriorities],
    [IndexStore.ticketsCountByStatuses, reports.ticketsCountByStatuses],
    [IndexStore.ticketsCountByHandlers, reports.ticketsCountByHandlers],
    [IndexStore.ticketsCountByMonths, reports.ticketsCountByMonths],
    [IndexStore.admins, admins],

    [guidelineCategoriesAtom, guidelineCategories],
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

      {user?.roleName !== ROLES.SUPER_ADMIN && (
        <div>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <AnnouncementContainer
              setOpenAnnouncement={setOpenAnnouncement}
              setOpenAnnouncementModal={setOpenAnnouncementModal}
              initialTake={announcement.initialTake}
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
        {user?.roleName === ROLES.SUPER_ADMIN && <ReportDashboard />}

        {user?.roleName === ROLES.ADMIN &&
          unmarkedMessage.messages.length > 0 && (
            <UnmarkedMessageContainer take={unmarkedMessage.initialTake} />
          )}

        {user?.roleName === ROLES.ADMIN && (
          <MessageContainer take={markedMessage.initialTake} />
        )}

        {user?.roleName === ROLES.USER && <GuidelineContainer />}
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

    let announcementsCount = 0,
      announcements: Announcement[] = [];
    const initialAnnouncementsTake = 4,
      initialAnnouncementsSkip = 0;

    if (user.roleName !== ROLES.SUPER_ADMIN) {
      ({ count: announcementsCount, announcements } =
        await announcementService.getBySemester(
          sessionActiveSemester.id,
          true,
          initialAnnouncementsTake,
          initialAnnouncementsSkip
        ));
    }

    // const {count:announcementCount, announcements} =
    //   user.roleName !== ROLES.SUPER_ADMIN
    //     ? await announcementService.getBySemester(
    //         sessionActiveSemester.id,
    //         true
    //       )
    //     : [];

    const initialTake = 10;
    const initialSkip = 0;
    const { messages, count } =
      user?.roleName !== ROLES.ADMIN
        ? { messages: [], count: 0 }
        : await messageService.getMessages(initialTake, initialSkip);

    const unmarkedInitialTake = 10;
    const unmarkedInitialSkip = 0;
    const { messages: unmarkedMessages, count: unmarkedCount } =
      user?.roleName !== ROLES.ADMIN
        ? { messages: [], count: 0 }
        : await messageService.getUnmarkedMessages(
            unmarkedInitialTake,
            unmarkedInitialSkip
          );

    let guidelineCategories = null;
    if (user?.roleName === ROLES.USER) {
      ({ guidelineCategories } = await guidelineCatSvc.getAll());
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
        guidelineCategories,
        ticketSummary,
        admins,
        announcement: {
          announcements,
          count: announcementsCount,
          initialTake: initialAnnouncementsTake,
          initialSkip: initialAnnouncementsSkip,
        },
        unmarkedMessage: {
          messages: unmarkedMessages,
          messageCount: unmarkedCount,
          initialTake: unmarkedInitialTake,
          initialSkip: unmarkedInitialSkip,
        },
        markedMessage: {
          messages,
          messageCount: count,
          initialTake,
          initialSkip,
        },
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
