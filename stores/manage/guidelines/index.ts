import { atom } from "jotai";
import { Guideline } from "../../../models/Guideline";
import { GuidelineCategory } from "../../../models/GuidelineCategory";

const GuidelineStore = {
    currGuidelineCategories: atom<GuidelineCategory[]>([]),
    currGuidelines: atom<Guideline[]>([]),
};

export default GuidelineStore;