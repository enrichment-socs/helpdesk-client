import { atom, useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { NextPage } from "next";
import { useState } from "react";
import CategoriesFormModal from "../../../components/categories/CategoriesFormModal";
import ManageCategoriesTable from "../../../components/categories/ManageCategoriesTable";
import Layout from "../../../components/shared/_Layout";
import { Category } from "../../../models/Category";
import { CategoriesService } from "../../../services/CategoriesService";
import { SemestersService } from "../../../services/SemestersService";

type Prop = {
    categories: Category[]
}

export const categoriesAtom = atom([] as Category[]);

const ManageCategoriesPage: NextPage<Prop> = ({ categories }) => {
    const [categoriesVal,] = useAtom(categoriesAtom);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useHydrateAtoms([
        [categoriesAtom, categories]
    ]);

    const openModal = (category: Category | null) => {
        setSelectedCategory(category);
        setOpenFormModal(true);
    };

    return (
        <Layout>
            <CategoriesFormModal
                isOpen={openFormModal}
                setIsOpen={setOpenFormModal}
                category={selectedCategory}
            />
            <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
                <h1>Manage Category</h1>
                <button
                    type="button"
                    onClick={() => openModal(null)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Create
                </button>
            </div>

            <ManageCategoriesTable categories={categoriesVal} openModal={openModal} />
        </Layout>
    );
}

export async function getServerSideProps() {
    const categories = await CategoriesService.getAll();
    const semesters = await SemestersService.getSemesters();

    return {
        props: {
            categories,
            semesters,
        },
    };
}

export default ManageCategoriesPage;