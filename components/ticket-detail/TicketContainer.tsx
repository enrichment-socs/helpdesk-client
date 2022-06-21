import { ArchiveIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { ticketsAtom } from '../../pages/tickets';
import TicketTable from '../tickets/TicketTable';

export default function TicketContainer() {
  const [tickets] = useAtom(ticketsAtom);

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
        </div>
      </div>
    </>
  );
}
