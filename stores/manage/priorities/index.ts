import { atom } from "jotai";
import { Priority } from "../../../models/Priority";

const ManagePriorityStore = {
    priorities: atom<Priority[]>([]),
}

export default ManagePriorityStore;