import { atom } from "jotai";
import { Role } from "../../../models/Role";

const ManageRoleStore = {
    roles: atom<Role[]>([]),
}

export default ManageRoleStore;