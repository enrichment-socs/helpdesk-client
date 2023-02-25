import { atom } from 'jotai';
import { Semester } from '../../../models/Semester';

const ManageSemesterStore = {
  semesters: atom<Semester[]>([]),
  take: atom<number>(0),
  skip: atom<number>(0),
  count: atom<number>(0),
  pageNumber: atom<number>(1),
};

export default ManageSemesterStore;
