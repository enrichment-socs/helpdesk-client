import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import FAQFormModal from '../../../components/faqs/FAQFormModal';
import ManageFAQsTable from '../../../components/faqs/ManageFAQsTable';
import { FAQ } from '../../../models/FAQ';
import { FAQCategory } from '../../../models/FAQCategory';
import { SessionUser } from '../../../models/SessionUser';
import { FAQCategoryService } from '../../../services/FAQCategoryService';
import { FAQService } from '../../../services/FAQService';
import { SemesterService } from '../../../services/SemesterService';
import { ROLES } from '../../../shared/constants/roles';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import Layout from '../../../widgets/_Layout';
import { faqCategoriesAtom } from '../faq-categories';

export const faqsAtom = atom([] as FAQ[]);

type Props = {
  currFAQCategories: FAQCategory[];
  currFAQs: FAQ[];
};

const ManageFAQCategoriesPage: NextPage<Props> = ({ currFAQCategories, currFAQs }) => {
  const [faqs] = useAtom(faqsAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  useHydrateAtoms([[faqCategoriesAtom, currFAQCategories]] as const);
  useHydrateAtoms([[faqsAtom, currFAQs]] as const)

  const openModal = (faq: FAQ | null) => {
    setSelectedFAQ(faq);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <FAQFormModal
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
      <ManageFAQsTable
        faqs={faqs}
        openModal={openModal}
      />
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
    const faqCategoriesService = new FAQCategoryService(user.accessToken);
    const faqsService = new FAQService(user.accessToken);

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
