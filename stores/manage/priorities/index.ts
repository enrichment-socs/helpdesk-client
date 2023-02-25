import { atom } from "jotai";
import { Priority } from "../../../models/Priority";

const ManagePriorityStore = {
    ticketPriorities: atom<Priority[]>([]),
    take: atom<number>(0),
    skip: atom<number>(0),
    count: atom<number>(0),
    pageNumber: atom<number>(1),
}

export default ManagePriorityStore;