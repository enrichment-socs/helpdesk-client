import { atom } from "jotai";
import { GuidelineCategory } from "../../../models/GuidelineCategory";

const ManageGuidelineCategoryStore = {
    guidelineCategories: atom<GuidelineCategory[]>([]),
    take: atom<number>(0),
    skip: atom<number>(0),
    count: atom<number>(0),
    pageNumber: atom<number>(1),
}

export default ManageGuidelineCategoryStore;