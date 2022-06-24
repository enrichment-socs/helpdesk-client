import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ManageUsersTable from '../../../components/users/ManageUsersTable';
import { Role } from '../../../models/Role';
import { SessionUser } from '../../../models/SessionUser';
import { User } from '../../../models/User';
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

const ManageUsersPage: NextPage<Props> = ({ currRoles, currUsers }) => {
  const [users] = useAtom(usersAtom);
  useHydrateAtoms([[usersAtom, currUsers]] as const);

  const [selectedRoleID, setSelectedRoleID] = useState(null);
  const [searchNameInput, setSearchNameInput] = useState<string>(null);
  const [displayedUsers, setDisplayedUsers] = useState<User[] | null>(users);

  const filterUserByRoleAndName = () => {
    let filteredUsers =
      selectedRoleID && selectedRoleID !== 'all'
        ? users.filter((user) => user.role.id === selectedRoleID)
        : users;

    filteredUsers = searchNameInput && searchNameInput.trim() !== "" ? filteredUsers.filter((user) => user.name.toLowerCase().includes(searchNameInput.toLowerCase())) : filteredUsers;

    setDisplayedUsers(filteredUsers);
  };

  useEffect(() => {
    filterUserByRoleAndName();
  }, [selectedRoleID, searchNameInput]);

  return (
    <Layout>
      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Users</h1>
      </div>
      <div className="mb-4">
        <span className="font-bold">Filter By Role:</span>
        <select
          className="mt-1 block w-full pl-3 outline-none pr-10 py-2 text-base border sm:text-sm rounded-md"
          onChange={(event) => setSelectedRoleID(event.target.value)}>
          <option value="all">All</option>
          {currRoles.map((role, idx) => (
            <option key={idx} value={role.id}>
              {role.roleName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <span className="font-bold">Search By Name:</span>
        <input
          className="mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md"
          type="text"
          name="name"
          id="name"
          placeholder="Input user name..."
          onChange={(event) => setSearchNameInput(event.target.value)}
        />
      </div>
      <ManageUsersTable users={displayedUsers} />
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
    const usersService = new UserService(user.accessToken);
    const rolesService = new RoleService(user.accessToken);
    const currUsers = await usersService.getAll();
    const currRoles = await rolesService.getAll();

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
