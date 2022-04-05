import { useAtom } from 'jotai';
import { NextPage } from 'next';
import { semestersAtom } from '../../../atom';
import ManageSemestersTable from '../../../components/semesters/ManageSemestersTable';
import Layout from '../../../components/shared/_Layout';
import { SemestersService } from '../../../services/SemestersService';

const ManageSemestersPage: NextPage = () => {
  const [semesters] = useAtom(semestersAtom);

  return (
    <Layout>
      <div className='font-bold text-2xl mb-4 flex items-center justify-between  '>
        <h1>Manage Semesters</h1>
        <button
          type='button'
          className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
          Create
        </button>
      </div>
      <ManageSemestersTable semesters={semesters} />
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
