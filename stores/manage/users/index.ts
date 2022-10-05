import { atom } from "jotai";
import { User } from "../../../models/User";

const UserStore = {
    users: atom<User[]>([]),
}

export default UserStore;