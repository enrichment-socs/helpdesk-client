import { atom, useAtom } from 'jotai';
import { useHydrateAtoms, useUpdateAtom } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
import { ClientPromiseWrapper } from '../../../shared/libs/client-promise-wrapper';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import ManageUserStore from '../../../stores/manage/users';
import CustomPaginator from '../../../widgets/CustomPaginator';
import Layout from '../../../widgets/_Layout';

type Props = {
  currRoles: Role[];
  currUsers: User[];
  initialSkip: number;
  initialTake: number;
  count: number;
};

const ManageUsersPage: NextPage<Props> = ({
  currRoles,
  currUsers: serverUsers,
  initialSkip,
  initialTake,
  count: initialCount,
}) => {
  const [users] = useAtom(ManageUserStore.users);
  useHydrateAtoms([[ManageUserStore.users, serverUsers]] as const);
  const updateCurrentUsers = useUpdateAtom(ManageUserStore.users);

  const [displayedUsers, setDisplayedUsers] = useState<User[] | null>(users);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const { roleId: roleIdQuery, query: searchQuery } = router.query;

  const [roleIdFilter, setRoleIdFilter] = useState(
    (roleIdQuery as string) || ''
  );
  const [queryFilter, setQueryFilter] = useState((searchQuery as string) || '');

  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const [skip, setSkip] = useState(initialSkip);
  const session = useSession();
  const user = session.data.user as SessionUser;
  const userService = new UserService(user.accessToken);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    router.push({
      query: {
        roleId: roleIdFilter,
        query: queryFilter,
      },
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
    setCount(users.length);
  }, [users]);

  const fetchUsers = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);
    const filter: UserFilterModel = {
      roleId: roleIdFilter,
      query: queryFilter,
    };

    const { users } = await wrapper.handle(
      userService.getUsersByFilter(filter, take, skip)
    );

    return users;
  };

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
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none">
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
        <span className="font-bold">
          Search By Name / Code / Email / Department:
        </span>
        <input
          className="mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md"
          type="text"
          name="name"
          id="name"
          placeholder="Input user name..."
          onChange={(event) => setQueryFilter(event.target.value)}
        />
      </div>
      <ManageUsersTable openModal={openModal} />

      <CustomPaginator
        take={initialTake}
        skip={skip}
        totalCount={count}
        setSkip={setSkip}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        threeFirstPageNumbers={threeFirstPageNumber}
        setThreeFirstPageNumbers={setThreeFirstPageNumber}
        fetchItem={fetchUsers}
        setItem={setDisplayedUsers}
      />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, query }) {
    const { session, ...globalProps } = await getInitialServerProps(req);

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.SUPER_ADMIN])) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const { roleId, query: searchQuery } = query;
    const initialTake = 10;
    const initialSkip = 0;
    const user = session.user as SessionUser;
    const usersService = new UserService(user.accessToken);
    const rolesService = new RoleService(user.accessToken);
    const currRoles = await rolesService.getAll();

    const filter: UserFilterModel = {
      roleId: (roleId as string) || '',
      query: (searchQuery as string) || '',
    };

    const { count, users: currUsers } = await usersService.getUsersByFilter(
      filter,
      initialTake,
      initialSkip
    );

    return {
      props: {
        ...globalProps,
        session,
        initialTake,
        initialSkip,
        currRoles,
        currUsers,
        count,
      },
    };
  }
);

export default ManageUsersPage;
