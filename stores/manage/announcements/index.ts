import { atom } from "jotai";
import { Announcement } from "../../../models/Announcement";

const AnnouncementStore = {
    announcements: atom<Announcement[]>([]),
}

export default AnnouncementStore;