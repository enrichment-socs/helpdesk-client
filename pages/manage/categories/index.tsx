import { atom, useAtom } from 'jotai';
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

type Props = {
  categories: Category[];
};

const ManageCategoriesPage: NextPage<Props> = ({ categories }) => {
  const [categoriesVal] = useAtom(ManageCategoryStore.categories);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useHydrateAtoms([[ManageCategoryStore.categories, categories]] as const);

  const openModal = (category: Category | null) => {
    setSelectedCategory(category);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <CategoriesFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        category={selectedCategory}
      />
      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Ticket Category</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create
        </button>
      </div>

      <ManageCategoriesTable categories={categoriesVal} openModal={openModal} />
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
    const categories = await categoriesService.getAll();

    return {
      props: {
        ...globalProps,
        session,
        categories,
      },
    };
  }
);

export default ManageCategoriesPage;
