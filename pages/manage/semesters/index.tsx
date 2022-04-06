import { useAtom } from 'jotai';
import { NextPage } from 'next';
import { useState } from 'react';
import { semestersAtom } from '../../../atom';
import ManageSemestersTable from '../../../components/semesters/ManageSemestersTable';
import SemesterFormModal from '../../../components/semesters/SemesterFormModal';
import Layout from '../../../components/shared/_Layout';
import { Semester } from '../../../models/Semester';
import { SemestersService } from '../../../services/SemestersService';

const ManageSemestersPage: NextPage = () => {
  const [semesters] = useAtom(semestersAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null,
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

      <div className='font-bold text-2xl mb-4 flex items-center justify-between  '>
        <h1>Manage Semesters</h1>
        <button
          onClick={() => openModal(null)}
          type='button'
          className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
          Create
        </button>
      </div>
      <ManageSemestersTable semesters={semesters} openModal={openModal} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const semesters = await SemestersService.getSemesters();

  return {
    props: {
      semesters,
    },
  };
}

export default ManageSemestersPage;
