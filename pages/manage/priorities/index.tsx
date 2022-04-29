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
import { PrioritiesService } from '../../../services/PrioritiesService';
import { SemestersService } from '../../../services/SemestersService';

type Props = {
  priorities: Priority[];
};

export const prioritiesAtom = atom([] as Priority[]);

const ManageCategoriesPage: NextPage<Props> = ({ priorities }) => {
  const [prioritiesVal] = useAtom(prioritiesAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(
    null
  );

  useHydrateAtoms([[prioritiesAtom, priorities]] as const);

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
        <h1>Manage Priority</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create
        </button>
      </div>

      <ManagePrioritiesTable priorities={prioritiesVal} openModal={openModal} />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemestersService());

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.SUPER_ADMIN])) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const priorities = await PrioritiesService.getAll();

    return {
      props: {
        priorities,
        semesters,
        session,
        sessionActiveSemester,
      },
    };
  }
);

export default ManageCategoriesPage;
