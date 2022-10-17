import { atom } from "jotai";
import { Role } from "../../../models/Role";
import { User } from "../../../models/User";

const ManageUserStore = {
    users: atom<User[]>([]),
    roles: atom<Role[]>([]),
}

export default ManageUserStore;