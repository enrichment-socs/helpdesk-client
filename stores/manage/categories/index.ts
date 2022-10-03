import { atom } from "jotai";
import { Category } from "../../../models/Category";

const CategoryStore = {
    categories: atom<Category[]>([]),
}

export default CategoryStore;