import { ArchiveIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { activeSemesterAtom } from '../../atom';
import { SessionUser } from '../../models/SessionUser';
import { Ticket } from '../../models/Ticket';
import { TicketService } from '../../services/TicketService';
import { ROLES } from '../../shared/constants/roles';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import CustomPaginator from '../../widgets/CustomPaginator';
import TicketTable from '../tickets/TicketTable';

type Props = {
  tickets: Ticket[];
  setTickets: Dispatch<SetStateAction<Ticket[]>>;
  take: number;
  skip: number;
  setSkip: Dispatch<SetStateAction<number>>;
  totalCount: number;
};

export default function TicketContainer({
  tickets,
  take,
  skip,
  setSkip,
  totalCount,
  setTickets,
}: Props) {
  const [pageNumber, setPageNumber] = useState(1);
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const session = useSession();
  const user = session.data.user as SessionUser;
  const ticketService = new TicketService(user.accessToken);
  const [activeSemester] = useAtom(activeSemesterAtom);

  const fetchTickets = async (take: number, skip: number) => {
    const requesterName = user?.roleName === ROLES.USER ? user?.email : null;
    const wrapper = new ClientPromiseWrapper(toast);
    const { tickets } = await wrapper.handle(
      ticketService.getTicketsBySemester(
        activeSemester.id,
        requesterName,
        take,
        skip
      )
    );
    return tickets;
  };

  return (
    <>
      <div className="ml-2 mt-5 p-2 border-2 rounded divide-y">
        <div className="flex justify-between">
          <div className="text-lg font-bold mb-3 flex items-center">
            <ArchiveIcon className="h-5 w-5" />
            <span className="ml-3">Tickets</span>
          </div>
        </div>
        <div className="p-1">
          <TicketTable tickets={tickets} />

          <CustomPaginator
            take={take}
            skip={skip}
            totalCount={totalCount}
            setSkip={setSkip}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            threeFirstPageNumbers={threeFirstPageNumber}
            setThreeFirstPageNumbers={setThreeFirstPageNumber}
            fetchItem={fetchTickets}
            setItem={setTickets}
          />
        </div>
      </div>
    </>
  );
}
