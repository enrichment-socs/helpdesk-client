import { useHydrateAtoms } from 'jotai/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import FAQContainer from '../../components/faqs/FAQContainer';
import { FAQCategory } from '../../models/FAQCategory';
import { SessionUser } from '../../models/SessionUser';
import { FAQCategoryService } from '../../services/FAQCategoryService';
import { FAQService } from '../../services/FAQService';
import { SemesterService } from '../../services/SemesterService';
import { ROLES } from '../../shared/constants/roles';
import { AuthHelper } from '../../shared/libs/auth-helper';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../shared/libs/session';
import Layout from '../../widgets/_Layout';

type Props = {
  faqCategories: FAQCategory[];
};

const FAQPage: NextPage<Props> = ({ faqCategories }) => {
  return (
    <Layout>
      <FAQContainer faqCategories={faqCategories} />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemesterService());

    if (
      !AuthHelper.isLoggedInAndHasRole(session, [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
      ])
    )
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    const user = session?.user as SessionUser;
    const faqCategoryService = new FAQCategoryService(user?.accessToken);

    // TO BE DELETED
    // const faqService = new FAQService(user?.accessToken);
    // const faqs = await faqService.getAll();
    const faqCategories = await faqCategoryService.getAll();

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        faqCategories,
      },
    };
  }
);

export default FAQPage;
