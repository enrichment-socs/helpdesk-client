import { useRouter } from 'next/router';
import { differenceInHours, format } from 'date-fns';
import { Ticket } from '../../models/Ticket';
import { STATUS } from '../../shared/constants/status';
import { PRIORITY } from '../../shared/constants/priority';
import clsx from 'clsx';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type Props = {
  tickets: Ticket[];
  showLegends?: boolean;
  forPending?: boolean;
};

const TicketTable: React.FC<Props> = ({
  tickets,
  showLegends = true,
  forPending = false,
}) => {
  const columnHelper = createColumnHelper<Ticket>();
  const columns = [
    columnHelper.accessor('number', {
      cell: (info) => `#${info.getValue()}`,
      header: 'No',
    }),
    columnHelper.accessor('subject', {
      cell: (info) => info.getValue() || 'No Subject',
      id: 'subject',
      header: 'Subject',
    }),
    columnHelper.accessor('senderName', {
      cell: (info) => info.getValue(),
      id: 'senderName',
      header: 'Requester Name',
    }),
    columnHelper.accessor('assignedTo.name', {
      cell: (info) => info.getValue(),
      header: 'Assigned To',
    }),
    columnHelper.accessor('dueBy', {
      cell: (info) =>
        `${format(new Date(info.getValue()), 'dd MMM yyyy, kk:mm')}`,
      header: `Due By ${forPending ? '(Freezed)' : ''}`,
    }),
    columnHelper.accessor('status.statusName', {
      cell: (info) => info.getValue(),
      header: 'Status',
    }),
    columnHelper.accessor('priority.priorityName', {
      cell: (info) => info.getValue(),
      header: 'Priority',
    }),
    columnHelper.accessor('created_at', {
      cell: (info) =>
        `${format(new Date(info.getValue()), 'dd MMM yyyy, kk:mm')}`,
      header: 'Created At',
    }),
  ];

  const table = useReactTable({
    data: tickets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const router = useRouter();
  const legends = [
    {
      color: 'bg-amber-200',
      title: 'High',
    },
    {
      color: 'bg-red-300',
      title: 'Urgent',
    },
    {
      color: 'bg-red-400',
      title: 'Due in 12 hours / passed deadline',
    },
    {
      color: 'bg-green-200',
      title: 'Closed',
    },
  ];

  const rowClickHandler = (id: string) => {
    router.push(`/tickets/${id}`);
  };

  const getRowBgColor = (ticket: Ticket) => {
    const currDate = new Date();
    const dueDate = new Date(ticket.dueBy);

    if (ticket.status.statusName === STATUS.PENDING) {
      return 'bg-yellow-200 hover:bg-yellow-300';
    }

    if (ticket.status.statusName === STATUS.CLOSED)
      return 'bg-green-200 hover:bg-green-300';
    if (
      currDate.getTime() > dueDate.getTime() ||
      differenceInHours(dueDate, currDate) <= 12
    )
      return 'bg-red-400 hover:bg-red-500';
    if (ticket.priority.priorityName === PRIORITY.URGENT)
      return 'bg-red-300 hover:bg-red-400';
    if (ticket.priority.priorityName === PRIORITY.HIGH)
      return 'bg-amber-200 hover:bg-amber-300';

    return '';
  };

  return (
    <>
      {showLegends && (
        <div className="flex items-center" style={{ overflowX: 'auto' }}>
          <div className="mr-4 text-sm font-semibold">Legends:</div>
          <ul className="flex space-x-4 py-4 items-center">
            {legends.map((legend) => (
              <li key={legend.title} className="flex space-x-1 items-center">
                <div className={`w-4 h-4 ${legend.color}`}></div>
                <div className="text-sm truncate">{legend.title}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col overflow-hidden border border-gray-200">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-auto border-b border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-500">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          {header.column.columnDef.header}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length == 0 && (
                    <tr>
                      <td
                        colSpan={table.getHeaderGroups()[0].headers.length}
                        className="text-center p-4">
                        There are currently no ticket
                      </td>
                    </tr>
                  )}

                  {table.getRowModel().rows.map((row, idx) => {
                    return (
                      <tr
                        className={clsx(
                          'transition duration-300 ease-in-out hover:bg-sky-100 cursor-pointer transition duration-300 hover:bg-sky-100 ease-in-out',
                          getRowBgColor(row.original)
                        )}
                        onClick={rowClickHandler.bind(this, row.original.id)}
                        key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={clsx(
                              'px-6 py-4 whitespace-nowrap text-sm font-medium truncate',
                              {
                                'max-w-[16rem]':
                                  cell.column.id === 'senderName',
                              },
                              { 'max-w-[20rem]': cell.column.id === 'subject' }
                            )}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketTable;
