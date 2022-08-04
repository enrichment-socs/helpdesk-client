import { ArchiveIcon } from '@heroicons/react/solid';
import { InformationCircleIcon } from '@heroicons/react/outline';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { activeSemesterAtom } from '../../atom';
import { Priority } from '../../models/Priority';
import { SessionUser } from '../../models/SessionUser';
import { PendingTicketFilterModel, Ticket } from '../../models/Ticket';
import { TicketService } from '../../services/TicketService';
import { ROLES } from '../../shared/constants/roles';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import CustomPaginator from '../../widgets/CustomPaginator';
import TicketTable from '../tickets/TicketTable';
import ReactTooltip from 'react-tooltip';

type Props = {
  pendingTickets: Ticket[];
  setPendingTickets: Dispatch<SetStateAction<Ticket[]>>;
  take: number;
  skip: number;
  setSkip: Dispatch<SetStateAction<number>>;
  totalCount: number;
  priorities: Priority[];
};

export default function PendingTicketContainer({
  pendingTickets,
  take,
  skip,
  setSkip,
  totalCount,
  setPendingTickets,
  priorities,
}: Props) {
  const [pageNumber, setPageNumber] = useState(1);
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const session = useSession();
  const user = session.data.user as SessionUser;
  const ticketService = new TicketService(user.accessToken);
  const [activeSemester] = useAtom(activeSemesterAtom);
  const router = useRouter();

  const { pendingPriority: priorityNameQuery, pendingQuery: searchQuery } =
    router.query;

  const onPriorityFilterChange = (e) => {
    updateRouter(e.target.value, searchQuery as string);
  };

  const onQueryFilterChange = (e) => {
    const ENTER_KEY_CODE = 13;
    if (e.keyCode === ENTER_KEY_CODE)
      updateRouter(priorityNameQuery as string, e.target.value);
  };

  const updateRouter = (pendingPriority: string, pendingQuery: string) => {
    router.push({
      query: {
        ...router.query,
        pendingPriority,
        pendingQuery,
      },
    });
    setPageNumber(1);
  };

  const fetchTickets = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);
    const filter: PendingTicketFilterModel = {
      priority: priorityNameQuery as string,
      query: searchQuery as string,
    };
    const { tickets } = await wrapper.handle(
      ticketService.getPendingTicketsBySemester(
        activeSemester.id,
        filter,
        take,
        skip
      )
    );
    return tickets;
  };

  return (
    <>
      <div className="ml-2 mt-5 p-2 border-2 rounded divide-y">
        <div className="overflow-x-auto flex justify-between items-center px-2 mb-2">
          <div className="text-lg font-bold mb-3 mt-2 flex items-center">
            <ArchiveIcon className="h-5 w-5" />
            <span className="ml-3 mr-10 flex items-center">
              <div className="mr-2">
                {user?.roleName === ROLES.USER ? 'My' : ''} Pending Tickets
              </div>
              <InformationCircleIcon
                data-tip
                data-for="pending-ticket-desc"
                className="w-5 h-5"
              />

              <ReactTooltip
                id="pending-ticket-desc"
                place="right"
                effect="solid">
                <div>
                  Ticket which status is <b>Pending</b> means that the problem
                  depends on external factor(s) that are outside of our
                  team&lsquo;s control (ex: waiting for data from another
                  division), hence the deadline of the ticket will be frozen
                  until it is resolved.
                </div>
              </ReactTooltip>
            </span>
          </div>

          <div className="flex space-x-4 items-center">
            <div className="text-sm md:text-lg">Filter:</div>

            <div>
              <select
                onChange={onPriorityFilterChange}
                value={(priorityNameQuery as string).toLowerCase()}
                className="min-w-[10rem] mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 cursor-pointer focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                <option value="">All Priority</option>
                {priorities.map((priority) => (
                  <option
                    value={priority.priorityName.toLowerCase()}
                    key={priority.id}>
                    {priority.priorityName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="text"
                onKeyDown={onQueryFilterChange}
                defaultValue={searchQuery as string}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border py-2 px-4 w-[22rem] border-gray-300 rounded-md"
                placeholder="Filter by Subject / Requester Name / Assigned to"
              />
            </div>
          </div>
        </div>
        <div className="p-1">
          <TicketTable
            showLegends={false}
            tickets={pendingTickets}
            forPending
          />

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
            setItem={setPendingTickets}
          />
        </div>
      </div>
    </>
  );
}
