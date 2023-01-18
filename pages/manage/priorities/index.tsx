import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
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
import { SemesterService } from '../../../services/SemesterService';
import { SessionUser } from '../../../models/SessionUser';
import ManagePriorityStore from '../../../stores/manage/priorities';

type Props = {
  priorities: Priority[];
};

const ManageCategoriesPage: NextPage<Props> = ({ priorities }) => {
  const [prioritiesVal] = useAtom(ManagePriorityStore.priorities);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(
    null
  );

  useHydrateAtoms([[ManagePriorityStore.priorities, priorities]] as const);

  const openModal = (priority: Priority | null) => {
    setSelectedPriority(priority);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <PrioritiesFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        priority={selectedPriority}
      />
      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Ticket Priority</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none">
          Create
        </button>
      </div>

      <ManagePrioritiesTable priorities={prioritiesVal} openModal={openModal} />
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
    const priorities = await prioritiesService.getAll();

    return {
      props: {
        ...globalProps,
        priorities,
        session,
      },
    };
  }
);

export default ManageCategoriesPage;
