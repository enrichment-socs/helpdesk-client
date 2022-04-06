import { NextPage } from "next";
import Layout from "../../../components/shared/_Layout";
import ManageStatusTable from "../../../components/status/ManageStatusTable";
import { SemestersService } from "../../../services/SemestersService";
import { StatusService } from "../../../services/StatusService";

const ManageStatusPage: NextPage = ({ status }) => {
  return (
    <Layout>
      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Status</h1>
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create
        </button>
      </div>

      <ManageStatusTable status={status} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const status = await StatusService.getAll();
  const semesters = await SemestersService.getSemesters();

  return {
    props: {
      status,
      semesters,
    },
  };
}

export default ManageStatusPage;
