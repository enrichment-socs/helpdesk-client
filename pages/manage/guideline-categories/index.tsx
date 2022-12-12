import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import GuidelineCategoryFormModal from '../../../components/guideline-categories/GuidelineCategoryFormModal';
import ManageGuidelineCategoriesTable from '../../../components/guideline-categories/ManageGuidelineCategoriesTable';
import Layout from '../../../widgets/_Layout';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { GuidelineCategory } from '../../../models/GuidelineCategory';
import { GuidelineCategoryService } from '../../../services/GuidelineCategoryService';
import { SemesterService } from '../../../services/SemesterService';
import { SessionUser } from '../../../models/SessionUser';
import { guidelineCategoriesAtom } from '../../../atom';

type Props = {
  currFAQCategories: GuidelineCategory[];
};

const ManageFAQCategoriesPage: NextPage<Props> = ({ currFAQCategories }) => {
  const [faqCategories] = useAtom(guidelineCategoriesAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedFAQCategory, setSelectedFAQCategory] =
    useState<GuidelineCategory | null>(null);

  useHydrateAtoms([[guidelineCategoriesAtom, currFAQCategories]] as const);

  const openModal = (faqCategory: GuidelineCategory | null) => {
    setSelectedFAQCategory(faqCategory);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <GuidelineCategoryFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        faqCategory={selectedFAQCategory}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Guideline Categories</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create
        </button>
      </div>
      <ManageGuidelineCategoriesTable
        faqCategories={faqCategories}
        openModal={openModal}
      />
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
    const faqCategoriesService = new GuidelineCategoryService(user.accessToken);
    const currFAQCategories = await faqCategoriesService.getAll();

    return {
      props: {
        ...globalProps,
        session,
        currFAQCategories,
      },
    };
  }
);

export default ManageFAQCategoriesPage;
