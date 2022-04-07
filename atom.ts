import { atom } from 'jotai';
import { Semester } from './models/Semester';

export const activeSemesterAtom = atom<Semester>(null);
export const semestersAtom = atom([] as Semester[]);
