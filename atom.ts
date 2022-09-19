import { atom } from 'jotai';
import { Semester } from './models/Semester';

export const activeSemesterAtom = atom<Semester>(null);
export const semestersAtom = atom([] as Semester[]);

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
