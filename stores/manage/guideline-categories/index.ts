import { atom } from "jotai";
import { GuidelineCategory } from "../../../models/GuidelineCategory";

const ManageGuidelineCategoriesStore = {
    // guidelineCategories: atom<GuidelineCategory[]>([]),
    take: atom<number>(0),
    skip: atom<number>(0),
    count: atom<number>(0),
}

export default ManageGuidelineCategoriesStore;