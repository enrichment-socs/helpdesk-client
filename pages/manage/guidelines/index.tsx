import { useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { guidelineCategoriesAtom } from '../../../atom';
import ManageGuidelinesContainer from '../../../components/guidelines/ManageGuidelinesContainer';
import useHydrateAndSyncAtom from '../../../hooks/useHydrateAndSyncAtom';
import { Guideline } from '../../../models/Guideline';
import { GuidelineCategory } from '../../../models/GuidelineCategory';
import { SessionUser } from '../../../models/SessionUser';
import { GuidelineCategoryService } from '../../../services/GuidelineCategoryService';
import { GuidelineService } from '../../../services/GuidelineService';
import { ROLES } from '../../../shared/constants/roles';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import ManageGuidelineStore from '../../../stores/manage/guidelines';
import Layout from '../../../widgets/_Layout';

type Props = {
  currFAQCategories: GuidelineCategory[];
  currFAQs: Guideline[];
  initialTake: number;
  initialSkip: number;
  count: number;
};

const ManageFAQCategoriesPage: NextPage<Props> = ({
  currFAQCategories,
  currFAQs,
  initialTake,
  initialSkip,
  count
}) => {
  useHydrateAndSyncAtom([
    [guidelineCategoriesAtom, useSetAtom(guidelineCategoriesAtom), currFAQCategories],
    [ManageGuidelineStore.guidelines, useSetAtom(ManageGuidelineStore.guidelines), currFAQs],
    [ManageGuidelineStore.take, useSetAtom(ManageGuidelineStore.take), initialTake],
    [ManageGuidelineStore.skip, useSetAtom(ManageGuidelineStore.skip), initialSkip],
    [ManageGuidelineStore.count, useSetAtom(ManageGuidelineStore.count), count],
  ]);

  return (
    <Layout>
      <ManageGuidelinesContainer />
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
    const faqCategoriesService = new GuidelineCategoryService(user.accessToken);
    const faqsService = new GuidelineService(user.accessToken);

    const { guidelineCategories: currFAQCategories } =
      await faqCategoriesService.getAll();
    const initialTake = 10;
    const initialSkip = 0;

    const { count, guidelines: currFAQs } = await faqsService.getAll(
      initialTake,
      initialSkip
    );

    return {
      props: {
        ...globalProps,
        session,
        currFAQCategories,
        currFAQs,
        initialTake,
        initialSkip,
        count,
      },
    };
  }
);

export default ManageFAQCategoriesPage;
