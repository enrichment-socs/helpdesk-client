import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { confirm } from '../../shared/libs/confirm-dialog-helper';
import { Guideline } from '../../models/Guideline';
import { SessionUser } from '../../models/SessionUser';
import { GuidelineService } from '../../services/GuidelineService';
import ManageGuidelineStore from '../../stores/manage/guidelines';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import GeneralTable from '../GeneralTable';

type Props = {
  openModal: (faqs: Guideline | null) => void;
  updateData: () => void;
};

const ManageGuidelinesTable: React.FC<Props> = ({ openModal, updateData }) => {
  const [guidelines, setGuidelines] = useAtom(ManageGuidelineStore.guidelines);
  const columnHelper = createColumnHelper<Guideline>();
  const columns = [
    columnHelper.accessor('question', {
      cell: (info) => info.getValue(),
      header: 'Guideline Question',
    }),
    columnHelper.accessor('guidelineCategory.categoryName', {
      cell: (info) => info.getValue(),
      header: 'Guideline Category',
    }),
    columnHelper.display({
      id: 'action',
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => openModal(info.row.original)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Update
          </button>
          <button
            type="button"
            onClick={() => onDelete(info.row.original)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Delete
          </button>
        </div>
      ),
      header: '',
    }),
  ];

  const table = useReactTable({
    data: guidelines,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const onDelete = async (guideline: Guideline) => {
    const guidelineService = new GuidelineService(user.accessToken);
    const message = `Are you sure you want to delete guideline "<b>${guideline.question}</b>" ?`;
    if (await confirm(message)) {
      await toast.promise(guidelineService.deleteFAQ(guideline.id), {
        loading: 'Deleting guideline...',
        success: (r) => {
          // setGuidelines(guidelines.filter((f) => f.id !== guideline.id));

          updateData();

          return 'Sucesfully deleted the selected guideline';
        },
        error: (e) => e.toString(),
      });
    }
  };

  return <GeneralTable table={table} />;
};

export default ManageGuidelinesTable;
