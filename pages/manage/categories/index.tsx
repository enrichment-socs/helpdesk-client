import { atom, useAtom, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import CategoriesFormModal from '../../../components/categories/CategoriesFormModal';
import ManageCategoriesTable from '../../../components/categories/ManageCategoriesTable';
import Layout from '../../../widgets/_Layout';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { Category } from '../../../models/Category';
import { CategoryService } from '../../../services/CategoryService';
import { SemesterService } from '../../../services/SemesterService';
import { SessionUser } from '../../../models/SessionUser';
import ManageCategoryStore from '../../../stores/manage/categories';
import useHydrateAndSyncAtom from '../../../hooks/useHydrateAndSyncAtom';
import ManageCategoriesContainer from '../../../components/categories/ManageCategoriesContainer';

type Props = {
  ticketCategories: Category[];
  initialTake: number;
  initialSkip: number;
  count: number;
};

const ManageCategoriesPage: NextPage<Props> = ({ ticketCategories, initialTake, initialSkip, count }) => {
  useHydrateAndSyncAtom([
    [ManageCategoryStore.ticketCategories, useSetAtom(ManageCategoryStore.ticketCategories), ticketCategories],
    [ManageCategoryStore.take, useSetAtom(ManageCategoryStore.take), initialTake],
    [ManageCategoryStore.skip, useSetAtom(ManageCategoryStore.skip), initialSkip],
    [ManageCategoryStore.count, useSetAtom(ManageCategoryStore.count), count],
    [ManageCategoryStore.pageNumber, useSetAtom(ManageCategoryStore.pageNumber), 1],
  ]);
  

  return (
    <Layout>
      <ManageCategoriesContainer />
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
    const categoriesService = new CategoryService(user.accessToken);
    
    const initialTake = 10;
    const initialSkip = 0; 
    const { count, ticketCategories } = await categoriesService.getAll(initialTake, initialSkip);

    return {
      props: {
        ...globalProps,
        session,
        ticketCategories,
        initialTake,
        initialSkip,
        count,
      },
    };
  }
);

export default ManageCategoriesPage;
