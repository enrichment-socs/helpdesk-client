import { atom } from "jotai";
import { Status } from "../../../models/Status";

const StatusStore = {
    status: atom<Status[]>([]),
}

export default StatusStore;