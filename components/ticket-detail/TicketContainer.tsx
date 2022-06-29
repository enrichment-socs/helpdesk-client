import { ArchiveIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { Ticket } from '../../models/Ticket';
import TicketTable from '../tickets/TicketTable';

type Props = {
  tickets: Ticket[];
};

export default function TicketContainer({ tickets }: Props) {
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
