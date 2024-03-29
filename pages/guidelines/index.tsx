import { useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { guidelineCategoriesAtom } from '../../atom';
import GuidelineContainer from '../../components/guidelines/GuidelineContainer';
import useHydrateAndSyncAtom from '../../hooks/useHydrateAndSyncAtom';
import { GuidelineCategory } from '../../models/GuidelineCategory';
import { SessionUser } from '../../models/SessionUser';
import { GuidelineCategoryService } from '../../services/GuidelineCategoryService';
import { GuidelineService } from '../../services/GuidelineService';
import { SemesterService } from '../../services/SemesterService';
import { ROLES } from '../../shared/constants/roles';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import Layout from '../../widgets/_Layout';

type Props = {
  guidelineCategories: GuidelineCategory[];
};

const GuidelinePage: NextPage<Props> = ({ guidelineCategories }) => {
  useHydrateAndSyncAtom([
    [
      guidelineCategoriesAtom,
      useSetAtom(guidelineCategoriesAtom),
      guidelineCategories,
    ],
  ]);

  return (
    <Layout>
      <GuidelineContainer />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, sessionActiveSemester, ...globalProps } =
      await getInitialServerProps(req);

    if (
      !AuthHelper.isLoggedInAndHasRole(session, [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
      ])
    )
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    const user = session?.user as SessionUser;
    const guidelineCategoryService = new GuidelineCategoryService(
      user?.accessToken
    );

    const { guidelineCategories } = await guidelineCategoryService.getAll();

    return {
      props: {
        ...globalProps,
        session,
        sessionActiveSemester,
        guidelineCategories,
      },
    };
  }
);

export default GuidelinePage;
