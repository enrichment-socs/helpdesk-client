import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import Layout from '../../../widgets/_Layout';
import ManageStatusTable from '../../../components/status/ManageStatusTable';
import StatusFormModal from '../../../components/status/StatusFormModal';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { Status } from '../../../models/Status';
import { SemestersService } from '../../../services/SemestersService';
import { StatusService } from '../../../services/StatusService';
import { SessionUser } from '../../../models/SessionUser';

export const statusAtom = atom([] as Status[]);

type Props = {
  currStatuses: Status[];
};

const ManageStatusPage: NextPage<Props> = ({ currStatuses }) => {
  const [statuses] = useAtom(statusAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  useHydrateAtoms([[statusAtom, currStatuses]] as const);

  const openModal = (status: Status | null) => {
    setSelectedStatus(status);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <StatusFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        status={selectedStatus}
      />
      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Status</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create
        </button>
      </div>

      <ManageStatusTable statuses={statuses} openModal={openModal} />
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

    const user = session.user as SessionUser;
    const statusService = new StatusService(user.accessToken);
    const currStatuses = await statusService.getAll();

    return {
      props: {
        currStatuses,
        semesters,
        session,
        sessionActiveSemester,
      },
    };
  }
);

export default ManageStatusPage;
