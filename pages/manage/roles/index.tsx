import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import ManageRolesTable from '../../../components/roles/ManageRolesTable';
import RoleFormModal from '../../../components/roles/RoleFormModal';
import Layout from '../../../widgets/_Layout';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { Role } from '../../../models/Role';
import { RoleService } from '../../../services/RoleService';
import { SemesterService } from '../../../services/SemesterService';
import { SessionUser } from '../../../models/SessionUser';

export const rolesAtom = atom([] as Role[]);

type Props = {
  currRoles: Role[];
};

const ManageRolesPage: NextPage<Props> = ({ currRoles }) => {
  const [roles] = useAtom(rolesAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useHydrateAtoms([[rolesAtom, currRoles]] as const);

  const openModal = (role: Role | null) => {
    setSelectedRole(role);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <RoleFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        role={selectedRole}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Roles</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create
        </button>
      </div>
      <ManageRolesTable roles={roles} openModal={openModal} />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemesterService());

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.SUPER_ADMIN])) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const user = session.user as SessionUser;
    const rolesService = new RoleService(user.accessToken);
    const currRoles = await rolesService.getAll();

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        currRoles,
      },
    };
  }
);

export default ManageRolesPage;
