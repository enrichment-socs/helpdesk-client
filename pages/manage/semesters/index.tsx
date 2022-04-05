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
      <div className='font-bold text-2xl mb-6'>
        <h1>Manage Semesters</h1>
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
