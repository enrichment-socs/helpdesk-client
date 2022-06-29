import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../../widgets/_Layout';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import { SemesterService } from '../../services/SemesterService';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { ROLES } from '../../shared/constants/roles';
import { atom } from 'jotai';
import { Ticket } from '../../models/Ticket';
import { useHydrateAtoms } from 'jotai/utils';
import { TicketService } from '../../services/TicketService';
import { SessionUser } from '../../models/SessionUser';
import TicketContainer from '../../components/ticket-detail/TicketContainer';

type Props = {
  tickets: Ticket[];
};

const TicketPage: NextPage<Props> = ({ tickets }) => {
  return (
    <Layout
      controlWidth={false}
      className="max-w-[96rem] px-2 sm:px-6 lg:px-8 mx-auto mb-8">
      <TicketContainer tickets={tickets} />
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

    const user = session.user as SessionUser;
    const ticketService = new TicketService(user?.accessToken);
    const tickets =
      user?.roleName === ROLES.USER
        ? await ticketService.getTicketsBySemester(
            sessionActiveSemester.id,
            user?.email
          )
        : await ticketService.getTicketsBySemester(sessionActiveSemester.id);

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        tickets,
      },
    };
  }
);

export default TicketPage;
