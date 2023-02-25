import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Priority } from '../../models/Priority';
import { SessionUser } from '../../models/SessionUser';
import { PriorityService } from '../../services/PriorityService';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import ManagePriorityStore from '../../stores/manage/priorities';
import CustomPaginator from '../../widgets/CustomPaginator';
import ManagePrioritiesTable from './ManagePrioritiesTable';
import PrioritiesFormModal from './PrioritiesFormModal';

export default function ManagePrioritiesContainer() {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(
    null
  );
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const session = useSession();
  const user = session.data.user as SessionUser;
  const ticketPriorityService = new PriorityService(user.accessToken);
  const [ticketPriorities, setTicketPriorities] = useAtom(
    ManagePriorityStore.ticketPriorities
  );
  const [pageNumber, setPageNumber] = useAtom(ManagePriorityStore.pageNumber);
  const [take, setTake] = useAtom(ManagePriorityStore.take);
  const [skip, setSkip] = useAtom(ManagePriorityStore.skip);
  const [count, setCount] = useAtom(ManagePriorityStore.count);

  const getTicketPriorities = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);

    return wrapper.handle(ticketPriorityService.getAll(take, skip));
  };

  const fetchTicketPriorities = async (take: number, skip: number) => {
    const { ticketPriorities } = await getTicketPriorities(take, skip);

    return ticketPriorities;
  };

  const openModal = (priority: Priority | null) => {
    setSelectedPriority(priority);
    setOpenFormModal(true);
  };

  const updateTicketPrioritiesData = async () => {
    let count = 0,
      ticketPriorities = [];

    ({ count, ticketPriorities } = await getTicketPriorities(take, skip));

    if (ticketPriorities.length === 0 && count > 0 && pageNumber > 1) {
      let newSkip = skip - take;

      ({ count, ticketPriorities } = await getTicketPriorities(take, newSkip));

      setPageNumber((prev) => prev - 1);
      setSkip(newSkip);
    }

    setCount(count);
    setTicketPriorities(ticketPriorities);
  };

  return (
    <>
      <PrioritiesFormModal
        isOpen={openFormModal}
        setIsOpen={setOpenFormModal}
        priority={selectedPriority}
        updateData={updateTicketPrioritiesData}
      />
      <div className="font-bold text-2xl mb-4 flex items-center justify-between  ">
        <h1>Manage Ticket Priority</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none">
          Create
        </button>
      </div>

      <ManagePrioritiesTable
        priorities={ticketPriorities}
        openModal={openModal}
        updateData={updateTicketPrioritiesData}
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
        fetchItem={fetchTicketPriorities}
        setItem={setTicketPriorities}
      />
    </>
  );
}
