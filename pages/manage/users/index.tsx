import { atom, useAtom } from 'jotai';
import { useHydrateAtoms, useUpdateAtom } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ManageUsersTable from '../../../components/users/ManageUsersTable';
import UserFormModal from '../../../components/users/UserFormModal';
import { Role } from '../../../models/Role';
import { SessionUser } from '../../../models/SessionUser';
import { User, UserFilterModel } from '../../../models/User';
import { RoleService } from '../../../services/RoleService';
import { SemesterService } from '../../../services/SemesterService';
import { UserService } from '../../../services/UserService';
import { ROLES } from '../../../shared/constants/roles';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import Layout from '../../../widgets/_Layout';

export const usersAtom = atom([] as User[]);

type Props = {
  currRoles: Role[];
  currUsers: User[];
};

const ManageUsersPage: NextPage<Props> = ({ currRoles, currUsers: serverUsers }) => {
  const [users] = useAtom(usersAtom);
  useHydrateAtoms([[usersAtom, serverUsers]] as const);
  const updateCurrentUsers = useUpdateAtom(usersAtom);

  const [displayedUsers, setDisplayedUsers] = useState<User[] | null>(users);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const {
    roleId: roleIdQuery,
    query: searchQuery,
  } = router.query;

  const [roleIdFilter, setRoleIdFilter] = useState((roleIdQuery as string) || '');
  const [queryFilter, setQueryFilter] = useState((searchQuery as string) || '');

  useEffect(() => {
    router.push({
      query: {
        roleId: roleIdFilter,
        query: queryFilter,
      }
    });
  }, [roleIdFilter, queryFilter]);

  const openModal = (user: User | null) => {
    setSelectedUser(user);
    setOpenFormModal(true);
  };

  useEffect(() => {
    setDisplayedUsers(serverUsers);
    updateCurrentUsers(serverUsers);
  }, [serverUsers]);

  useEffect(() => {
    setDisplayedUsers(users);
  }, [users]);

  return (
    <Layout>
      <UserFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        user={selectedUser}
        currRoles={currRoles}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Users</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create
        </button>
      </div>
      <div className="mb-4">
        <span className="font-bold">Filter By Role:</span>
        <select
          className="mt-1 block w-full pl-3 outline-none pr-10 py-2 text-base border sm:text-sm rounded-md"
          onChange={(event) => setRoleIdFilter(event.target.value)}>
          <option value="">All</option>
          {currRoles.map((role, idx) => (
            <option key={idx} value={role.id}>
              {role.roleName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <span className="font-bold">Search By Name / Code / Email / Department:</span>
        <input
          className="mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md"
          type="text"
          name="name"
          id="name"
          placeholder="Input user name..."
          onChange={(event) => setQueryFilter(event.target.value)}
        />
      </div>
      <ManageUsersTable users={displayedUsers} openModal={openModal} />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, query }) {
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

    const { roleId, query: searchQuery } = query;
    const user = session.user as SessionUser;
    const usersService = new UserService(user.accessToken);
    const rolesService = new RoleService(user.accessToken);
    const currRoles = await rolesService.getAll();

    const filter: UserFilterModel = {
      roleId: (roleId as string) || '',
      query: (searchQuery as string) || '',
    };

    const currUsers = await usersService.getUsersByFilter(filter);

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        currRoles,
        currUsers,
      },
    };
  }
);

export default ManageUsersPage;
