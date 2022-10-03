import { atom } from "jotai";
import { Priority } from "../../../models/Priority";

const PriorityStore = {
    priorities: atom<Priority[]>([]),
}

export default PriorityStore;