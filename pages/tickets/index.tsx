import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../../widgets/_Layout';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import { SemesterService } from '../../services/SemesterService';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { ROLES } from '../../shared/constants/roles';
import { PendingTicketFilterModel, Ticket, TicketFilterModel } from '../../models/Ticket';
import { TicketService } from '../../services/TicketService';
import { SessionUser } from '../../models/SessionUser';
import TicketContainer from '../../components/ticket-detail/TicketContainer';
import { useEffect, useState } from 'react';
import { TicketStatusService } from '../../services/TicketStatusService';
import { StatusService } from '../../services/StatusService';
import { Status } from '../../models/Status';
import { PriorityService } from '../../services/PriorityService';
import { Priority } from '../../models/Priority';
import { STATUS } from '../../shared/constants/status';
import PendingTicketContainer from '../../components/ticket-detail/PendingTicketContainer';

type Props = {
  tickets: Ticket[];
  pendingTickets: Ticket[];
  count: number;
  pendingCount: number;
  initialTake: number;
  initialSkip: number;
  pendingInitialTake: number;
  pendingInitialSkip: number;
  statuses: Status[];
  priorities: Priority[];
};

const TicketPage: NextPage<Props> = ({
  tickets: serverTickets,
  pendingTickets: serverPendingTickets,
  count,
  pendingCount,
  initialSkip,
  initialTake,
  pendingInitialSkip,
  pendingInitialTake,
  statuses,
  priorities,
}) => {
  const [skip, setSkip] = useState(initialSkip);
  const [tickets, setTickets] = useState(serverTickets);

  const [pendingSkip, setPendingSkip] = useState(pendingInitialSkip);
  const [pendingTickets, setPendingTickets] = useState(serverPendingTickets);

  useEffect(() => {
    setTickets(serverTickets);
  }, [serverTickets]);

  useEffect(() => {
    setPendingTickets(serverPendingTickets);
  }, [serverPendingTickets]);

  return (
    <Layout
      controlWidth={false}
      className="max-w-[96rem] px-2 sm:px-6 lg:px-8 mx-auto mb-8">
      <TicketContainer
        take={initialTake}
        skip={skip}
        setSkip={setSkip}
        totalCount={count}
        tickets={tickets}
        setTickets={setTickets}
        statuses={statuses}
        priorities={priorities}
      />

      <PendingTicketContainer 
        take={pendingInitialTake}
        skip={pendingSkip}
        setSkip={setPendingSkip}
        totalCount={pendingCount}
        pendingTickets={pendingTickets}
        setPendingTickets={setPendingTickets}
        priorities={priorities}
      />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, query }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemesterService());

    if (
      !AuthHelper.isLoggedInAndHasRole(session, [
        ROLES.ADMIN,
        ROLES.USER,
        ROLES.SUPER_ADMIN,
      ])
    )
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    const { priority, status, query: searchQuery } = query;
    const initialTake = 10;
    const initialSkip = 0;
    const filter: TicketFilterModel = {
      priority: (priority as string) || '',
      query: (searchQuery as string) || '',
      status: (status as string) || '',
    };


    const { pendingPriority, pendingQuery: pendingSearchQuery } = query;
    const pendingInitialTake = 10;
    const pendingInitialSkip = 0;
    const pendingFilter: PendingTicketFilterModel = {
      priority: (pendingPriority as string) || '',
      query: (pendingSearchQuery as string) || '',
    }

    const user = session.user as SessionUser;
    const ticketService = new TicketService(user?.accessToken);
    const statusService = new StatusService(user?.accessToken);
    const priorityService = new PriorityService(user?.accessToken);

    

    const { count, tickets } = await ticketService.getTicketsBySemester(
      sessionActiveSemester.id,
      filter,
      initialTake,
      initialSkip
    );

    const { count: pendingCount, tickets: pendingTickets } = await ticketService.getPendingTicketsBySemester(
      sessionActiveSemester.id,
      pendingFilter,
      pendingInitialTake,
      pendingInitialSkip
    );

    let statuses = await statusService.getAll();
    const priorities = await priorityService.getAll();

    statuses = statuses.filter((status) => status.statusName !== STATUS.PENDING);
    
    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        tickets,
        pendingTickets,
        count,
        pendingCount,
        initialTake,
        initialSkip,
        pendingInitialTake,
        pendingInitialSkip,
        statuses,
        priorities,
      },
    };
  }
);

export default TicketPage;
