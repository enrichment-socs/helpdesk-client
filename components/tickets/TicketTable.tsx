import { useRouter } from 'next/router';
import { differenceInHours, format } from 'date-fns';
import { Ticket } from '../../models/Ticket';
import { STATUS } from '../../shared/constants/status';
import { PRIORITY } from '../../shared/constants/priority';

type Props = {
  tickets: Ticket[];
};

const TicketTable: React.FC<Props> = ({ tickets }) => {
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

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-auto border-b border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-500">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Subject
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Requester Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Due By
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Priority
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length == 0 && (
                    <tr className="text-center">
                      <td colSpan={7} className="p-4 text-center">
                        There are currently no tickets
                      </td>
                    </tr>
                  )}

                  {tickets &&
                    tickets.map((data, index) => (
                      <tr
                        key={data.id}
                        className={`cursor-pointer ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50 '
                        } transition duration-300 hover:bg-sky-100 ease-in-out ${getRowBgColor(
                          data
                        )}`}
                        onClick={rowClickHandler.bind(this, data.id)}>
                        <td className="max-w-[32rem] truncate px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {data.subject || 'No Subject'}
                        </td>
                        <td className="max-w-[16rem] truncate px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {data.senderName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {data.assignedTo.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {format(new Date(data.dueBy), 'dd MMM yyyy, kk:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {data.status.statusName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {data.priority.priorityName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {format(
                            new Date(data.created_at),
                            'dd MMM yyyy, kk:mm'
                          )}
                        </td>
                      </tr>
                    ))}
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
