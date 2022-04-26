import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { Priority } from '../../models/Priority';
import { prioritiesAtom } from '../../pages/manage/priorities';
import { PrioritiesService } from '../../services/PrioritiesService';

type Prop = {
  priorities: Priority[];
  openModal: (priority: Priority | null) => void;
};

export default function ManagePrioritiesTable({ priorities, openModal }: Prop) {
  const [, setPrioritiesVal] = useAtom(prioritiesAtom);

  const onDelete = async (priority: Priority) => {
    const message = `Are you sure you want to delete ${priority.priorityName}?`;
    if (await confirm(message)) {
      await toast.promise(PrioritiesService.delete(priority.id), {
        loading: 'Deleting priority...',
        success: (r) => {
          setPrioritiesVal(priorities.filter((cat) => cat.id !== priority.id));
          return 'Sucesfully deleted the selected priority';
        },
        error: (e) => e.toString(),
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Priority Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Priority Index
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {priorities &&
                  priorities.map((priority, index) => (
                    <tr
                      key={priority.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {priority.priorityName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {priority.priorityIndex}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                        <button
                          type="button"
                          onClick={() => openModal(priority)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(priority)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          Delete
                        </button>
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
