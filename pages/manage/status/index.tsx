import { atom, useAtom } from "jotai";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../../../components/shared/_Layout";
import ManageStatusTable from "../../../components/status/ManageStatusTable";
import StatusFormModal from "../../../components/status/StatusFormModal";
import { Status } from "../../../models/Status";
import { SemestersService } from "../../../services/SemestersService";
import { StatusService } from "../../../services/StatusService";

export const statusAtom = atom([] as Status[]);

const ManageStatusPage: NextPage = ({ currStatuses }) => {
  const [statuses, setStatuses] = useAtom(statusAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  useEffect(() => {
    setStatuses(currStatuses);
  }, [currStatuses]);

  const openModal = (status: Status | null) => {
    setSelectedStatus(status);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <StatusFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        status={selectedStatus}
      />
      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Status</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create
        </button>
      </div>

      <ManageStatusTable statuses={statuses} openModal={openModal} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const currStatuses = await StatusService.getAll();
  const semesters = await SemestersService.getSemesters();

  return {
    props: {
      currStatuses,
      semesters,
    },
  };
}

export default ManageStatusPage;
