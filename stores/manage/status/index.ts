import { atom } from "jotai";
import { Status } from "../../../models/Status";

const ManageStatusStore = {
    status: atom<Status[]>([]),
}

export default ManageStatusStore;