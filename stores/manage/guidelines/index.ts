import { atom } from "jotai";
import { Guideline } from "../../../models/Guideline";
import { GuidelineCategory } from "../../../models/GuidelineCategory";

const ManageGuidelineStore = {
    guidelines: atom<Guideline[]>([]),
    take: atom<number>(0),
    skip: atom<number>(0),
    count: atom<number>(0),
    pageNumber: atom<number>(1),
};

export default ManageGuidelineStore;