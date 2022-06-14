import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { confirm } from '../../shared/libs/confirm-dialog-helper';
import { FAQ } from '../../models/FAQ';
import { SessionUser } from '../../models/SessionUser';
import { faqsAtom } from '../../pages/manage/faqs';
import { FAQService } from '../../services/FAQService';

type Props = {
  faqs: FAQ[];
  openModal: (faqs: FAQ | null) => void;
};

const ManageFAQsTable: React.FC<Props> = ({ faqs, openModal }) => {
  const [, setFAQs] = useAtom(faqsAtom);
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const onDelete = async (faq: FAQ) => {
    const faqService = new FAQService(user.accessToken);
    const message = `Are you sure you want to delete FAQ "<b>${faq.question}</b>" ?`;
    if (await confirm(message)) {
      await toast.promise(faqService.deleteFAQ(faq.id), {
        loading: 'Deleting FAQ...',
        success: (r) => {
          setFAQs(faqs.filter((f) => f.id !== faq.id));
          return 'Sucesfully deleted the selected FAQ';
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
                    FAQ Question
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    FAQ Category
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {faqs &&
                  faqs.map((faq, idx) => (
                    <tr
                      key={faq.id}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {faq.question}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {faq.faqCategory.categoryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                        <button
                          type="button"
                          onClick={() => openModal(faq)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(faq)}
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
};

export default ManageFAQsTable;