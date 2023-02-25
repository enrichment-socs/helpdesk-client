import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { activeSemesterAtom } from '../../atom';
import { GuidelineCategory } from '../../models/GuidelineCategory';
import { SessionUser } from '../../models/SessionUser';
import { GuidelineCategoryService } from '../../services/GuidelineCategoryService';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import ManageGuidelineCategoryStore from '../../stores/manage/guideline-categories';
import CustomPaginator from '../../widgets/CustomPaginator';
import GuidelineCategoryFormModal from './GuidelineCategoryFormModal';
import ManageGuidelineCategoriesTable from './ManageGuidelineCategoriesTable';

export default function ManageGuidelineCategoriesContainer() {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedFAQCategory, setSelectedFAQCategory] =
    useState<GuidelineCategory | null>(null);
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const session = useSession();
  const user = session.data.user as SessionUser;
  const guidelineCategoryService = new GuidelineCategoryService(
    user.accessToken
  );
  const [guidelineCategories, setGuidelineCategories] = useAtom(
    ManageGuidelineCategoryStore.guidelineCategories
  );
  const [pageNumber, setPageNumber] = useAtom(
    ManageGuidelineCategoryStore.pageNumber
  );
  const [take, setTake] = useAtom(ManageGuidelineCategoryStore.take);
  const [skip, setSkip] = useAtom(ManageGuidelineCategoryStore.skip);
  const [count, setCount] = useAtom(ManageGuidelineCategoryStore.count);

  const getGuidelineCategories = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);

    return wrapper.handle(guidelineCategoryService.getAll(take, skip));
  };

  const fetchGuidelineCategories = async (take: number, skip: number) => {
    const { guidelineCategories } = await getGuidelineCategories(take, skip);

    return guidelineCategories;
  };

  const openModal = (faqCategory: GuidelineCategory | null) => {
    setSelectedFAQCategory(faqCategory);
    setOpenFormModal(true);
  };

  const updateGuidelineCategoriesData = async () => {
    let count = 0,
      guidelineCategories = [];

    ({ count, guidelineCategories } = await getGuidelineCategories(take, skip));

    if (guidelineCategories.length === 0 && count > 0 && pageNumber > 1) {
      let newSkip = skip - take;

      ({ count, guidelineCategories } = await getGuidelineCategories(
        take,
        newSkip
      ));

      setPageNumber((prev) => prev - 1);
      setSkip(newSkip);
    }

    setCount(count);
    setGuidelineCategories(guidelineCategories);
  };

  return (
    <>
      <GuidelineCategoryFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        faqCategory={selectedFAQCategory}
        updateData={updateGuidelineCategoriesData}
      />

      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Guideline Categories</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none">
          Create
        </button>
      </div>
      <ManageGuidelineCategoriesTable
        faqCategories={guidelineCategories}
        openModal={openModal}
        updateData={updateGuidelineCategoriesData}
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
        fetchItem={fetchGuidelineCategories}
        setItem={setGuidelineCategories}
      />
    </>
  );
}
