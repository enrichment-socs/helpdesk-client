import { atom } from "jotai";
import { Role } from "../../../models/Role";

const RoleStore = {
    roles: atom<Role[]>([]),
}

export default RoleStore;