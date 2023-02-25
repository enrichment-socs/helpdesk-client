import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Category } from '../../models/Category';
import { SessionUser } from '../../models/SessionUser';
import { CategoryService } from '../../services/CategoryService';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import ManageCategoryStore from '../../stores/manage/categories';
import CustomPaginator from '../../widgets/CustomPaginator';
import CategoriesFormModal from './CategoriesFormModal';
import ManageCategoriesTable from './ManageCategoriesTable';

export default function ManageCategoriesContainer() {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const session = useSession();
  const user = session.data.user as SessionUser;
  const categoryService = new CategoryService(user.accessToken);
  const [ticketCategories, setTicketCategories] = useAtom(
    ManageCategoryStore.ticketCategories
  );
  const [pageNumber, setPageNumber] = useAtom(ManageCategoryStore.pageNumber);
  const [take, setTake] = useAtom(ManageCategoryStore.take);
  const [skip, setSkip] = useAtom(ManageCategoryStore.skip);
  const [count, setCount] = useAtom(ManageCategoryStore.count);

  const getTicketCategories = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);

    return wrapper.handle(categoryService.getAll(take, skip));
  };

  const fetchTicketCategories = async (take: number, skip: number) => {
    const { ticketCategories } = await getTicketCategories(take, skip);

    return ticketCategories;
  };

  const openModal = (category: Category | null) => {
    setSelectedCategory(category);
    setOpenFormModal(true);
  };

  const updateTicketCategoriesData = async () => {
    let count = 0,
      ticketCategories = [];

    ({ count, ticketCategories } = await getTicketCategories(take, skip));

    if (ticketCategories.length === 0 && count > 0 && pageNumber > 1) {
      let newSkip = skip - take;

      ({ count, ticketCategories } = await getTicketCategories(take, newSkip));

      setPageNumber((prev) => prev - 1);
      setSkip(newSkip);
    }

    setCount(count);
    setTicketCategories(ticketCategories);
  };

  return (
    <>
      <CategoriesFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        category={selectedCategory}
        updateData={updateTicketCategoriesData}
      />
      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Ticket Category</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none">
          Create
        </button>
      </div>

      <ManageCategoriesTable
        categories={ticketCategories}
        openModal={openModal}
        updateData={updateTicketCategoriesData}
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
        fetchItem={fetchTicketCategories}
        setItem={setTicketCategories}
      />
    </>
  );
}
