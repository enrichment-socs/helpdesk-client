import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../../widgets/_Layout';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import { SemesterService } from '../../services/SemesterService';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { ROLES } from '../../shared/constants/roles';
import { Ticket } from '../../models/Ticket';
import { TicketService } from '../../services/TicketService';
import { SessionUser } from '../../models/SessionUser';
import TicketContainer from '../../components/ticket-detail/TicketContainer';
import { useEffect, useState } from 'react';
import { TicketStatusService } from '../../services/TicketStatusService';
import { StatusService } from '../../services/StatusService';
import { Status } from '../../models/Status';
import { PriorityService } from '../../services/PriorityService';
import { Priority } from '../../models/Priority';

type Props = {
  tickets: Ticket[];
  count: number;
  initialTake: number;
  initialSkip: number;
  statuses: Status[];
  priorities: Priority[];
};

const TicketPage: NextPage<Props> = ({
  tickets: serverTickets,
  count,
  initialSkip,
  initialTake,
  statuses,
  priorities,
}) => {
  const [skip, setSkip] = useState(initialSkip);
  const [tickets, setTickets] = useState(serverTickets);

  useEffect(() => {
    setTickets(serverTickets);
  }, [serverTickets]);

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
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemesterService());

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.ADMIN, ROLES.USER]))
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    const initialTake = 10;
    const initialSkip = 0;
    const user = session.user as SessionUser;
    const ticketService = new TicketService(user?.accessToken);
    const statusService = new StatusService(user?.accessToken);
    const priorityService = new PriorityService(user?.accessToken);

    const requesterName = user?.roleName === ROLES.USER ? user.email : null;
    const { count, tickets } = await ticketService.getTicketsBySemester(
      sessionActiveSemester.id,
      requesterName,
      initialTake,
      initialSkip
    );
    const statuses = await statusService.getAll();
    const priorities = await priorityService.getAll();

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        tickets,
        count,
        initialTake,
        initialSkip,
        statuses,
        priorities,
      },
    };
  }
);

export default TicketPage;
