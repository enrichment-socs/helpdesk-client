import toast from 'react-hot-toast';
import { confirm } from '../../shared/libs/confirm-dialog-helper';
import { GuidelineCategory } from '../../models/GuidelineCategory';
import { GuidelineCategoryService } from '../../services/GuidelineCategoryService';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../models/SessionUser';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import GeneralTable from '../GeneralTable';

type Props = {
  faqCategories: GuidelineCategory[];
  openModal: (faqCategories: GuidelineCategory | null) => void;
  updateData: () => void;
};

export default function ManageGuidelineCategoriesTable({
  faqCategories,
  openModal,
  updateData,
}: Props) {
  const columnHelper = createColumnHelper<GuidelineCategory>();
  const columns = [
    columnHelper.accessor('categoryName', {
      cell: (info) => info.getValue(),
      header: 'Guideline Category Name',
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
    data: faqCategories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const onDelete = async (faqCategory: GuidelineCategory) => {
    const faqCategoriesService = new GuidelineCategoryService(user.accessToken);
    const message = `Are you sure you want to delete <b>${faqCategory.categoryName}</b> ?`;
    if (await confirm(message)) {
      await toast.promise(
        faqCategoriesService.deleteFAQCategory(faqCategory.id),
        {
          loading: 'Deleting Guideline category...',
          success: (r) => {
            // setFAQCategories(
            //   faqCategories.filter((fc) => fc.id !== faqCategory.id)
            // );

            updateData();

            return 'Sucesfully deleted the selected Guideline category';
          },
          error: (e) => e.toString(),
        }
      );
    }
  };

  return <GeneralTable table={table} />;
}
