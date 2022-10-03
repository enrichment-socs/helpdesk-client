import { atom } from "jotai";
import { Guideline } from "../../../models/Guideline";
import { GuidelineCategory } from "../../../models/GuidelineCategory";

const GuidelineStore = {
    guidelines: atom<Guideline[]>([]),
};

export default GuidelineStore;