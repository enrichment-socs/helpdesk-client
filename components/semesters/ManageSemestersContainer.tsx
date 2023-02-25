import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Semester } from '../../models/Semester';
import { SessionUser } from '../../models/SessionUser';
import { SemesterService } from '../../services/SemesterService';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import ManageSemesterStore from '../../stores/manage/semesters';
import CustomPaginator from '../../widgets/CustomPaginator';
import ManageSemestersTable from './ManageSemestersTable';
import SemesterFormModal from './SemesterFormModal';

export default function ManageSemestersContainer() {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null
  );
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const session = useSession();
  const user = session.data.user as SessionUser;
  const semesterService = new SemesterService(user.accessToken);
  const [semesters, setSemesters] = useAtom(ManageSemesterStore.semesters);
  const [pageNumber, setPageNumber] = useAtom(ManageSemesterStore.pageNumber);
  const [take, setTake] = useAtom(ManageSemesterStore.take);
  const [skip, setSkip] = useAtom(ManageSemesterStore.skip);
  const [count, setCount] = useAtom(ManageSemesterStore.count);

  const getSemesters = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);

    return wrapper.handle(semesterService.getSemesters(take, skip));
  };

  const fetchSemesters = async (take: number, skip: number) => {
    const { semesters } = await getSemesters(take, skip);

    return semesters;
  };

  const openModal = (semester: Semester | null) => {
    setSelectedSemester(semester);
    setOpenFormModal(true);
  };

  const updateSemestersData = async () => {
    let count = 0,
      semesters = [];

    ({ count, semesters } = await getSemesters(take, skip));

    if (semesters.length === 0 && count > 0 && pageNumber > 1) {
      let newSkip = skip - take;

      ({ count, semesters } = await getSemesters(take, newSkip));

      setPageNumber((prev) => prev - 1);
      setSkip(newSkip);
    }

    setCount(count);
    setSemesters(semesters);
  };

  return (
    <>
      <SemesterFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        semester={selectedSemester}
        updateData={updateSemestersData}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Semesters</h1>
        <button
          onClick={() => openModal(null)}
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none">
          Create
        </button>
      </div>
      
      <ManageSemestersTable
        openModal={openModal}
        updateData={updateSemestersData}
      />

      <CustomPaginator
        take={take}
        skip={skip}
        totalCount={count}
        setSkip={setSkip}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        threeFirstPageNumbers={threeFirstPageNumber}
        setThreeFirstPageNumbers={setThreeFirstPageNumber}
        fetchItem={fetchSemesters}
        setItem={setSemesters}
      />
    </>
  );
}
