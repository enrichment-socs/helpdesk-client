import { useSetAtom } from 'jotai';
import { NextPage } from 'next';
import Layout from '../../../widgets/_Layout';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { Semester } from '../../../models/Semester';
import { SemesterService } from '../../../services/SemesterService';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { SessionUser } from '../../../models/SessionUser';
import useHydrateAndSyncAtom from '../../../hooks/useHydrateAndSyncAtom';
import ManageSemesterStore from '../../../stores/manage/semesters';
import ManageSemestersContainer from '../../../components/semesters/ManageSemestersContainer';

type Props = {
  currSemesters: Semester[];
  semesters: Semester[];
  initialTake: number;
  initialSkip: number;
  count: number;
};

const ManageSemestersPage: NextPage<Props> = ({ currSemesters, initialTake, initialSkip, count}) => {
  useHydrateAndSyncAtom([
    [
      ManageSemesterStore.semesters,
      useSetAtom(ManageSemesterStore.semesters),
      currSemesters,
    ],
    [
      ManageSemesterStore.take,
      useSetAtom(ManageSemesterStore.take),
      initialTake,
    ],
    [
      ManageSemesterStore.skip,
      useSetAtom(ManageSemesterStore.skip),
      initialSkip,
    ],
    [
      ManageSemesterStore.count,
      useSetAtom(ManageSemesterStore.count),
      count,
    ],
    [
      ManageSemesterStore.pageNumber,
      useSetAtom(ManageSemesterStore.pageNumber),
      1,
    ],
  ]);

  return (
    <Layout>
      <ManageSemestersContainer />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, ...globalProps } = await getInitialServerProps(req);

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.SUPER_ADMIN])) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const user = session.user as SessionUser;
    const semesterService = new SemesterService(user.accessToken);
    const initialTake = 2;
    const initialSkip = 0;

    const { count, semesters:currSemesters } = await semesterService.getSemesters(initialTake, initialSkip);

    return {
      props: {
        ...globalProps,
        session,
        currSemesters,
        initialTake,
        initialSkip,
        count,
      },
    };
  }
);

export default ManageSemestersPage;
