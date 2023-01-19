import { format } from 'date-fns';
import { useAtom } from 'jotai';
import TicketDetailStore from '../../../stores/tickets/[id]';
import { Accordion } from '../../../widgets/Accordion';
import { TicketResolution } from '../../../models/TicketResolution';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import GeneralTable from '../../GeneralTable';

export default function TicketResolutionChangeLogTable() {
  const [resolutions] = useAtom(TicketDetailStore.resolutions);

  const columnHelper = createColumnHelper<TicketResolution>();
  const columns = [
    columnHelper.display({
      cell: (info) => info.row.index + 1,
      id: 'number',
      header: 'No',
    }),
    columnHelper.accessor('messageId', {
      cell: (info) => info.getValue(),
      header: 'Message ID',
    }),
    columnHelper.accessor('resolution', {
      cell: (info) => info.getValue() || '-',
      header: 'Reason',
    }),
    columnHelper.accessor('created_at', {
      cell: (info) => (
        <>{format(new Date(info.getValue()), 'yyyy-MM-dd HH:mm')}</>
      ),
      header: 'Start Date',
    }),
  ];

  const table = useReactTable({
    data: resolutions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Accordion title="Ticket Resolution History">
      <GeneralTable table={table} />
    </Accordion>
  );
}
