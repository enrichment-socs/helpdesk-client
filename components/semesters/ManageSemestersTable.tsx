import { confirm } from '../../lib/confirm-dialog-helper';
import { Semester } from '../../models/Semester';
import { SemestersService } from '../../services/SemestersService';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { semestersAtom } from '../../atom';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../models/SessionUser';

type Props = {
  semesters: Semester[];
  openModal: (semester: Semester | null) => void;
};

export default function ManageSemestersTable({ semesters, openModal }: Props) {
  const [, setSemesters] = useAtom(semestersAtom);
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const onDelete = async (semester: Semester) => {
    const message = `Are you sure you want to delete <b>${semester.type} Semester ${semester.startYear}/${semester.endYear}</b> ?`;
    if (await confirm(message)) {
      await toast.promise(
        SemestersService.deleteSemester(semester.id, user.accessToken),
        {
          loading: 'Deleting semester...',
          success: (r) => {
            setSemesters(semesters.filter((s) => s.id !== semester.id));
            return 'Sucesfully deleted the selected semester';
          },
          error: (e) => e.toString(),
        }
      );
    }
  };

  return (
    <>
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
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Start Year
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      End year
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {semesters &&
                    semesters.map((smt, idx) => (
                      <tr
                        key={smt.id}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {smt.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {smt.startYear}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {smt.endYear}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`${
                              smt.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            } inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                            {smt.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                          <button
                            type="button"
                            onClick={() => openModal(smt)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(smt)}
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
    </>
  );
}
