import { atom } from 'jotai';
import { Guideline } from './models/Guideline';
import { GuidelineCategory } from './models/GuidelineCategory';
import { Semester } from './models/Semester';

export const activeSemesterAtom = atom<Semester>(null);
export const semestersAtom = atom([] as Semester[]);
export const guidelineCategoriesAtom = atom([] as GuidelineCategory[]);
export const guidelinesAtom = atom([] as Guideline[]);

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
