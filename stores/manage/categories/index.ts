import { atom } from "jotai";
import { Category } from "../../../models/Category";

const ManageCategoryStore = {
    categories: atom<Category[]>([]),
}

export default ManageCategoryStore;