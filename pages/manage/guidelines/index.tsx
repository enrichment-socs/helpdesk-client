import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { guidelineCategoriesAtom } from '../../../atom';
import GuidelineFormModal from '../../../components/guidelines/GuidelineFormModal';
import ManageGuidelinesTable from '../../../components/guidelines/ManageGuidelineTable';
import { Guideline } from '../../../models/Guideline';
import { GuidelineCategory } from '../../../models/GuidelineCategory';
import { SessionUser } from '../../../models/SessionUser';
import { GuidelineCategoryService } from '../../../services/GuidelineCategoryService';
import { GuidelineService } from '../../../services/GuidelineService';
import { SemesterService } from '../../../services/SemesterService';
import { ROLES } from '../../../shared/constants/roles';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import GuidelineStore from '../../../stores/manage/guidelines';
import Layout from '../../../widgets/_Layout';

type Props = {
  currFAQCategories: GuidelineCategory[];
  currFAQs: Guideline[];
};

const ManageFAQCategoriesPage: NextPage<Props> = ({
  currFAQCategories,
  currFAQs,
}) => {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<Guideline | null>(null);

  useHydrateAtoms([
    [guidelineCategoriesAtom, currFAQCategories],
    [GuidelineStore.guidelines, currFAQs],
  ] as const);

  const openModal = (faq: Guideline | null) => {
    setSelectedFAQ(faq);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <GuidelineFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        faq={selectedFAQ}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage FAQ</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create
        </button>
      </div>
      <ManageGuidelinesTable openModal={openModal} />
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
    const faqCategoriesService = new GuidelineCategoryService(user.accessToken);
    const faqsService = new GuidelineService(user.accessToken);

    const currFAQCategories = await faqCategoriesService.getAll();
    const currFAQs = await faqsService.getAll();

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        currFAQCategories,
        currFAQs,
      },
    };
  }
);

export default ManageFAQCategoriesPage;
