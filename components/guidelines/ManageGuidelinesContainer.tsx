import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Guideline } from '../../models/Guideline';
import { SessionUser } from '../../models/SessionUser';
import { GuidelineService } from '../../services/GuidelineService';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import ManageGuidelineStore from '../../stores/manage/guidelines';
import CustomPaginator from '../../widgets/CustomPaginator';
import GuidelineFormModal from './GuidelineFormModal';
import ManageGuidelinesTable from './ManageGuidelineTable';

export default function ManageGuidelinesContainer() {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<Guideline | null>(null);
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const session = useSession();
  const user = session.data.user as SessionUser;
  const guidelineService = new GuidelineService(user.accessToken);
  const [guidelines, setGuidelines] = useAtom(ManageGuidelineStore.guidelines);
  const [pageNumber, setPageNumber] = useAtom(ManageGuidelineStore.pageNumber);
  const [take, setTake] = useAtom(ManageGuidelineStore.take);
  const [skip, setSkip] = useAtom(ManageGuidelineStore.skip);
  const [count, setCount] = useAtom(ManageGuidelineStore.count);

  const getGuidelines = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);

    return wrapper.handle(guidelineService.getAll(take, skip));
  };

  const fetchGuidelines = async (take: number, skip: number) => {
    const { guidelines } = await getGuidelines(take, skip);
    return guidelines;
  };

  const openModal = (faq: Guideline | null) => {
    setSelectedFAQ(faq);
    setOpenFormModal(true);
  };

  const updateGuidelinesData = async () => {
    let count = 0,
      guidelines = [];

    ({ count, guidelines } = await getGuidelines(take, skip));

    if (guidelines.length === 0 && count > 0 && pageNumber > 1) {
      let newSkip = skip - take;

      ({ count, guidelines } = await getGuidelines(take, newSkip));

      setPageNumber(pageNumber - 1);
      setSkip(newSkip);
    }

    setCount(count);
    setGuidelines(guidelines);
  };

  return (
    <>
      <GuidelineFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        faq={selectedFAQ}
        updateData={updateGuidelinesData}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Guideline</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none">
          Create
        </button>
      </div>

      <ManageGuidelinesTable
        openModal={openModal}
        updateData={updateGuidelinesData}
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
        fetchItem={fetchGuidelines}
        setItem={setGuidelines}
      />
    </>
  );
}
