import { atom, useAtom } from "jotai";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import ManageRolesTable from "../../../components/roles/ManageRolesTable";
import RoleFormModal from "../../../components/roles/RoleFormModal";
import Layout from "../../../components/shared/_Layout";
import { Role } from "../../../models/Role";
import { RolesService } from "../../../services/RolesService";
import { SemestersService } from "../../../services/SemestersService";

export const rolesAtom = atom([] as Role[]);

const ManageRolesPage: NextPage = ({ currRoles }) => {
  const [roles, setRoles] = useAtom(rolesAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    setRoles(currRoles);
  }, [currRoles]);

  const openModal = (role: Role | null) => {
    setSelectedRole(role);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <RoleFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        role={selectedRole}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Roles</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create
        </button>
      </div>
      <ManageRolesTable roles={roles} openModal={openModal} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const currRoles = await RolesService.getAll();
  const semesters = await SemestersService.getSemesters();

  return {
    props: {
      currRoles,
      semesters,
    },
  };
}

export default ManageRolesPage;
