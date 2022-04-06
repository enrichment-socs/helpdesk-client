import { atom, useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { NextPage } from "next";
import { useState } from "react";
import FAQCategoryFormModal from "../../../components/faq-categories/FAQCategoryFormModal";
import ManageFAQCategoriesTable from "../../../components/faq-categories/ManageFAQCategoriesTable";
import Layout from "../../../components/shared/_Layout";
import { FAQCategory } from "../../../models/FAQCategory";
import { FAQCategoriesService } from "../../../services/FAQCategoriesService";
import { SemestersService } from "../../../services/SemestersService";

export const faqCategoriesAtom = atom([] as FAQCategory[]);

const ManageFAQCategoriesPage: NextPage = ({ currFAQCategories }) => {
  const [faqCategories] = useAtom(faqCategoriesAtom);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedFAQCategory, setSelectedFAQCategory] = useState<FAQCategory | null>(null);

  useHydrateAtoms([[faqCategoriesAtom, currFAQCategories]]);

  const openModal = (faqCategory: FAQCategory | null) => {
    setSelectedFAQCategory(faqCategory);
    setOpenFormModal(true);
  };

  return (
    <Layout>
      <FAQCategoryFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        faqCategory={selectedFAQCategory}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage FAQ Categories</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create
        </button>
      </div>
      <ManageFAQCategoriesTable faqCategories={faqCategories} openModal={openModal} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const currFAQCategories = await FAQCategoriesService.getAll();
  const semesters = await SemestersService.getSemesters();

  return {
    props: {
      currFAQCategories,
      semesters,
    },
  };
}

export default ManageFAQCategoriesPage;
