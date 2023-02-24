import { atom } from "jotai";
import { Announcement } from "../../../models/Announcement";

const ManageAnnouncementStore = {
    announcements: atom<Announcement[]>([]),
    take: atom<number>(0),
    skip: atom<number>(0),
    count: atom<number>(0),
}

export default ManageAnnouncementStore;