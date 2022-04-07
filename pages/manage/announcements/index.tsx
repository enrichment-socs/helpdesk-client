import { atom, useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { NextPage } from "next";
import { useState } from "react";
import AnnouncementFormModal from "../../../components/announcements/AnnouncementFormModal";
import ManageAnnouncementsTable from "../../../components/announcements/ManageAnnouncementsTable";
import Layout from "../../../components/shared/_Layout";
import { Announcement } from "../../../models/Announcement";
import { AnnouncementsService } from "../../../services/AnnouncementService";
import { SemestersService } from "../../../services/SemestersService";

export const announcementsAtom = atom([] as Announcement[]);

const ManageRolesPage: NextPage = ({ currAnnouncements }) => {
  const [announcements] = useAtom(announcementsAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useHydrateAtoms([[announcementsAtom, currAnnouncements]]);

  const openModal = (announcement: Announcement | null) => {
    setSelectedAnnouncement(announcement);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <AnnouncementFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        announcement={selectedAnnouncement}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Announcements</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create
        </button>
      </div>
      <ManageAnnouncementsTable announcements={announcements} openModal={openModal} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const currAnnouncements = await AnnouncementsService.getAll();
  const semesters = await SemestersService.getSemesters();

  return {
    props: {
      currAnnouncements,
      semesters,
    },
  };
}

export default ManageRolesPage;
