import { atom } from 'jotai';
import { Guideline } from './models/Guideline';
import { GuidelineCategory } from './models/GuidelineCategory';
import { Notification } from './models/Notification';
import { Semester } from './models/Semester';

export const activeSemesterAtom = atom<Semester>(null);
export const semestersAtom = atom([] as Semester[]);
export const notificationsAtom = atom([] as Notification[]);
export const notificationsCountAtom = atom(0);
export const unreadNotificationsCountAtom = atom(0);

export const guidelineCategoriesAtom = atom([] as GuidelineCategory[]);

export const replyRecipientsAtom = atom<{
  messageId: string;
  subject: string;
  toRecipients: string;
  ccRecipients: string;
}>({
  messageId: '',
  subject: '',
  toRecipients: '',
  ccRecipients: '',
});
