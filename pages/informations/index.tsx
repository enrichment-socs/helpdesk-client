import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import InformationContainer from '../../components/informations/InformationContainer';
import { Information } from '../../models/Information';
import { SessionUser } from '../../models/SessionUser';
import { InformationService } from '../../services/InformationService';
import { SemesterService } from '../../services/SemesterService';
import { ROLES } from '../../shared/constants/roles';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import Layout from '../../widgets/_Layout';

export const informationsAtom = atom([] as Information[]);

type Props = {
  informations: Information[];
};

const InformationsPage: NextPage<Props> = ({ informations }) => {
  useHydrateAtoms([[informationsAtom, informations]] as const);

  return (
    <Layout>
      <InformationContainer />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemesterService());

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.ADMIN]))
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    const user = session?.user as SessionUser;
    const infoService = new InformationService(user?.accessToken);
    const informations = await infoService.getAll();

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        informations,
      },
    };
  }
);

export default InformationsPage;
