import { atom } from "jotai";
import { Guideline } from "../../../models/Guideline";
import { GuidelineCategory } from "../../../models/GuidelineCategory";

const ManageGuidelineStore = {
    guidelines: atom<Guideline[]>([]),
};

export default ManageGuidelineStore;