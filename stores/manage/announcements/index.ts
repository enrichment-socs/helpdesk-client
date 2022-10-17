import { atom } from "jotai";
import { Announcement } from "../../../models/Announcement";

const ManageAnnouncementStore = {
    announcements: atom<Announcement[]>([]),
}

export default ManageAnnouncementStore;