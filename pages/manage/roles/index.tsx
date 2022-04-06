import { useAtom } from "jotai";
import { NextPage } from "next";
import { semestersAtom } from "../../../atom";
import ManageRolesTable from "../../../components/roles/ManageRolesTable";
import Layout from "../../../components/shared/_Layout";
import { RolesService } from "../../../services/RolesService";
import { SemestersService } from "../../../services/SemestersService";

const ManageRolesPage: NextPage = ({ roles }) => {

  return (
    <Layout>
      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Roles</h1>
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create
        </button>
      </div>
      <ManageRolesTable roles={roles} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const roles = await RolesService.getAll();
  const semesters = await SemestersService.getSemesters();

  return {
    props: {
      roles,
      semesters,
    },
  };
}

export default ManageRolesPage;
