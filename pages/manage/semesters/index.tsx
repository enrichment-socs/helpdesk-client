import { useAtom } from 'jotai';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { semestersAtom } from '../../../atom';
import ManageSemestersTable from '../../../components/semesters/ManageSemestersTable';
import SemesterFormModal from '../../../components/semesters/SemesterFormModal';
import Layout from '../../../widgets/_Layout';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { Semester } from '../../../models/Semester';
import { SemesterService } from '../../../services/SemesterService';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';

const ManageSemestersPage: NextPage = () => {
  const [semesters] = useAtom(semestersAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null
  );

  const openModal = (semester: Semester | null) => {
    setSelectedSemester(semester);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <SemesterFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        semester={selectedSemester}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Semesters</h1>
        <button
          onClick={() => openModal(null)}
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create
        </button>
      </div>
      <ManageSemestersTable semesters={semesters} openModal={openModal} />
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

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
      },
    };
  }
);

export default ManageSemestersPage;
