import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../../widgets/_Layout';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import { SemesterService } from '../../services/SemesterService';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { ROLES } from '../../shared/constants/roles';
import {
  PendingTicketFilterModel,
  Ticket,
  TicketFilterModel,
} from '../../models/Ticket';
import { TicketService } from '../../services/TicketService';
import { SessionUser } from '../../models/SessionUser';
import TicketContainer from '../../components/ticket-detail/TicketContainer';
import { StatusService } from '../../services/StatusService';
import { Status } from '../../models/Status';
import { PriorityService } from '../../services/PriorityService';
import { Priority } from '../../models/Priority';
import { STATUS } from '../../shared/constants/status';
import PendingTicketContainer from '../../components/ticket-detail/PendingTicketContainer';
import { useHydrateAtoms } from 'jotai/utils';
import TicketStore from '../../stores/tickets';
import { Provider, useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useHydrateAndSyncAtom from '../../hooks/useHydrateAndSyncAtom';

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
  useHydrateAndSyncAtom([
    [TicketStore.tickets, useSetAtom(TicketStore.tickets), serverTickets],
    [TicketStore.skip, useSetAtom(TicketStore.skip), initialSkip],
    [
      TicketStore.pendingTickets,
      useSetAtom(TicketStore.pendingTickets),
      serverPendingTickets,
    ],
    [
      TicketStore.pendingSkip,
      useSetAtom(TicketStore.pendingSkip),
      pendingInitialSkip,
    ],
    [TicketStore.statuses, useSetAtom(TicketStore.statuses), statuses],
    [TicketStore.priorities, useSetAtom(TicketStore.priorities), priorities],
    [TicketStore.count, useSetAtom(TicketStore.count), count],
    [
      TicketStore.pendingCount,
      useSetAtom(TicketStore.pendingCount),
      pendingCount,
    ],
  ]);

  return (
    <Layout>
      <TicketContainer take={initialTake} />
      <PendingTicketContainer take={pendingInitialTake} />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, query }) {
    const { session, sessionActiveSemester, ...globalProps } =
      await getInitialServerProps(req);

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
    };

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

    const { count: pendingCount, tickets: pendingTickets } =
      await ticketService.getPendingTicketsBySemester(
        sessionActiveSemester.id,
        pendingFilter,
        pendingInitialTake,
        pendingInitialSkip
      );

    let statuses = await statusService.getAll();
    const priorities = await priorityService.getAll();

    statuses = statuses.filter(
      (status) => status.statusName !== STATUS.PENDING
    );

    return {
      props: {
        ...globalProps,
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
