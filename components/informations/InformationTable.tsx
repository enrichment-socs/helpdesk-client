import { format } from 'date-fns';
import { useAtom } from 'jotai';
import { Information } from '../../models/Information';
import { informationsAtom } from '../../pages/informations';

type Props = {
  openDetailModal: (info: Information) => void;
};

export default function InformationTable({ openDetailModal }: Props) {
  const [informations] = useAtom(informationsAtom);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full">
          <div className="max-h-[40rem] overflow-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 relative">
              <thead className="bg-gray-500">
                <tr>
                  <th
                    scope="col"
                    className="bg-gray-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    No
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Sender
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Received Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {informations.length == 0 && (
                  <tr className="text-center">
                    <td colSpan={5} className="p-4">
                      There are currently no informations
                    </td>
                  </tr>
                )}

                {informations.map((info, index) => (
                  <tr
                    key={index}
                    className={`cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } transition duration-300 ease-in-out hover:bg-sky-100`}
                    onClick={() => openDetailModal(info)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="max-w-[16rem] px-6 py-4 truncate text-sm font-medium text-gray-900">
                      {info.senderName}
                    </td>
                    <td className="max-w-[32rem] px-6 py-4 truncate text-sm text-gray-900">
                      {info.subject || 'No Subject'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(info.created_at), 'dd MMM yyyy, kk:mm')}
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
}
