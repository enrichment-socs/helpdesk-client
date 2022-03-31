import { atom } from 'jotai';
import { Semester } from './models/Semester';

export const activeSemesterIdAtom = atom('');
export const semestersAtom = atom([] as Semester[]);
