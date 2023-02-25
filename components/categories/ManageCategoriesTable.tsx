import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Category } from '../../models/Category';
import { SessionUser } from '../../models/SessionUser';
import { CategoryService } from '../../services/CategoryService';
import { confirm } from '../../shared/libs/confirm-dialog-helper';
import GeneralTable from '../GeneralTable';

type Prop = {
  categories: Category[];
  openModal: (category: Category | null) => void;
  updateData: () => void;
};

export default function ManageCategoriesTable({ categories, openModal, updateData }: Prop) {
  const columnHelper = createColumnHelper<Category>();
  const columns = [
    columnHelper.accessor('categoryName', {
      cell: (info) => info.getValue(),
      header: 'Category Name',
    }),
    columnHelper.accessor('description', {
      cell: (info) => (
        <ul>
          {info
            .getValue()
            .split(';')
            .map((criteria) => (
              <li key={criteria}>&#8226; {criteria}</li>
            ))}
        </ul>
      ),
      header: 'Description / Criteria',
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
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const onDelete = async (category: Category) => {
    const categoriesService = new CategoryService(user.accessToken);
    const message = `Are you sure you want to delete <b>${category.categoryName}</b>?`;
    if (await confirm(message)) {
      await toast.promise(categoriesService.delete(category.id), {
        loading: 'Deleting category...',
        success: (r) => {
          // setCategoriesVal(categories.filter((cat) => cat.id !== category.id));

          updateData();

          return 'Sucesfully deleted the selected category';
        },
        error: (e) => e.toString(),
      });
    }
  };

  return <GeneralTable table={table} />;
}
