import { atom, useAtom, useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { useState } from 'react';
import Layout from '../../../widgets/_Layout';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { GuidelineCategory } from '../../../models/GuidelineCategory';
import { GuidelineCategoryService } from '../../../services/GuidelineCategoryService';
import { SessionUser } from '../../../models/SessionUser';
import { guidelineCategoriesAtom } from '../../../atom';
import useHydrateAndSyncAtom from '../../../hooks/useHydrateAndSyncAtom';

import ManageGuidelineCategoriesContainer from '../../../components/guideline-categories/ManageGuidelineCategoriesContainer';
import ManageGuidelineCategoryStore from '../../../stores/manage/guideline-categories';

type Props = {
  currFAQCategories: GuidelineCategory[];
  initialTake: number;
  initialSkip: number;
  count: number;
};

const ManageFAQCategoriesPage: NextPage<Props> = ({ currFAQCategories, initialTake, initialSkip, count }) => {
  useHydrateAndSyncAtom([
    [
      guidelineCategoriesAtom,
      useSetAtom(guidelineCategoriesAtom),
      currFAQCategories,
    ],
    [
      ManageGuidelineCategoryStore.take,
      useSetAtom(ManageGuidelineCategoryStore.take),
      initialTake,
    ],
    [
      ManageGuidelineCategoryStore.skip,
      useSetAtom(ManageGuidelineCategoryStore.skip),
      initialSkip,
    ],
    [
      ManageGuidelineCategoryStore.count,
      useSetAtom(ManageGuidelineCategoryStore.count),
      count,
    ],
  ]);

  return (
    <Layout>
      <ManageGuidelineCategoriesContainer />
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
    const initialTake = 10;
    const initialSkip = 0;
    const { count, guidelineCategories: currFAQCategories } =
      await faqCategoriesService.getAll(initialTake, initialSkip);

    return {
      props: {
        ...globalProps,
        session,
        currFAQCategories,
        initialTake,
        initialSkip,
        count
      },
    };
  }
);

export default ManageFAQCategoriesPage;
