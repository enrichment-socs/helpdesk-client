import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { casesAtom } from '../../pages/requests';
import { format } from 'date-fns';
import { useHydrateAtoms } from 'jotai/utils';
import { Case } from '../../models/Case';

type Props = {
  cases: Case[];
};

const RequestsTable: React.FC<Props> = ({ cases }) => {
  const router = useRouter();

  const rowClickHandler = (id: string) => {
    router.push(`/requests/${id}`);
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200">
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
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {cases.length == 0 && (
                  <tr className="text-center">
                    <td colSpan={7} className="p-4">
                      There are currently no cases
                    </td>
                  </tr>
                )}

                {cases &&
                  cases.map((data, index) => (
                    <tr
                      key={data.id}
                      className={`cursor-pointer ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } transition duration-300 ease-in-out hover:bg-sky-100`}
                      onClick={rowClickHandler.bind(this, data.id)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.senderName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.assignedTo.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {format(new Date(data.dueBy), 'dd MMM yyyy, kk:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.status.statusName}
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
  );
};

export default RequestsTable;
