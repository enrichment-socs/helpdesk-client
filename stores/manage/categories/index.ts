import { atom } from "jotai";
import { Category } from "../../../models/Category";

const ManageCategoryStore = {
    ticketCategories: atom<Category[]>([]),
    take: atom<number>(0),
    skip: atom<number>(0),
    count: atom<number>(0),
    pageNumber: atom<number>(1),
}

export default ManageCategoryStore;