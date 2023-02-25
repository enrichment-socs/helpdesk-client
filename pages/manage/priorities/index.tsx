import { atom, useAtom, useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import ManagePrioritiesTable from '../../../components/priority/ManagePrioritiesTable';
import PrioritiesFormModal from '../../../components/priority/PrioritiesFormModal';
import Layout from '../../../widgets/_Layout';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { Priority } from '../../../models/Priority';
import { PriorityService } from '../../../services/PriorityService';
import { SessionUser } from '../../../models/SessionUser';
import ManagePriorityStore from '../../../stores/manage/priorities';
import useHydrateAndSyncAtom from '../../../hooks/useHydrateAndSyncAtom';
import ManagePrioritiesContainer from '../../../components/priority/ManagePrioritiesContainer';

type Props = {
  ticketPriorities: Priority[];
  count: number;
  initialTake: number;
  initialSkip: number;
};

const ManageCategoriesPage: NextPage<Props> = ({ ticketPriorities, initialTake, initialSkip, count }) => {
  useHydrateAndSyncAtom([
    [
      ManagePriorityStore.ticketPriorities,
      useSetAtom(ManagePriorityStore.ticketPriorities),
      ticketPriorities,
    ],
    [ManagePriorityStore.take, useSetAtom(ManagePriorityStore.take), initialTake],
    [ManagePriorityStore.skip, useSetAtom(ManagePriorityStore.skip), initialSkip],
    [ManagePriorityStore.count, useSetAtom(ManagePriorityStore.count), count],
    [ManagePriorityStore.pageNumber, useSetAtom(ManagePriorityStore.pageNumber), 1],
  ]);

  return (
    <Layout>
      <ManagePrioritiesContainer />
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
    const prioritiesService = new PriorityService(user.accessToken);
    const initialTake = 2;
    const initialSkip = 0;
    const {count, ticketPriorities} = await prioritiesService.getAll(initialTake, initialSkip);

    return {
      props: {
        ...globalProps,
        ticketPriorities,
        session,
        initialTake,
        initialSkip,
        count,
      },
    };
  }
);

export default ManageCategoriesPage;
