import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
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

type Props = {
  informations: Information[];
  count: number;
  initialTake: number;
  initialSkip: number;
};

const InformationsPage: NextPage<Props> = ({
  informations: serverInformations,
  count,
  initialSkip,
  initialTake,
}) => {
  const [skip, setSkip] = useState(initialSkip);
  const [informations, setInformations] = useState(serverInformations);

  useEffect(() => {
    setInformations(serverInformations);
  }, [serverInformations]);

  return (
    <Layout>
      <InformationContainer
        take={initialTake}
        skip={skip}
        setSkip={setSkip}
        totalCount={count}
        setInformations={setInformations}
        informations={informations}
      />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemesterService());

    if (
      !AuthHelper.isLoggedInAndHasRole(session, [
        ROLES.ADMIN,
        ROLES.SUPER_ADMIN,
      ])
    )
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    const user = session?.user as SessionUser;
    const infoService = new InformationService(user?.accessToken);
    const initialTake = 10;
    const initialSkip = 0;
    const { count, informations } = await infoService.getBySemester(
      sessionActiveSemester.id,
      initialTake,
      initialSkip
    );

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        informations,
        count,
        initialTake,
        initialSkip,
      },
    };
  }
);

export default InformationsPage;
