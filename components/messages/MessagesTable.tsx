import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useAtom } from 'jotai';
import { Dispatch, SetStateAction } from 'react';
import { Message } from '../../models/Message';
import { MESSAGE_TYPE } from '../../shared/constants/message-type';
import IndexStore from '../../stores';

type Props = {
  setOpenMessageModal: Dispatch<SetStateAction<boolean>>;
  setSelectedMessage: Dispatch<SetStateAction<Message>>;
  startNumber: number;
};

const MessagesTable = ({
  setOpenMessageModal,
  setSelectedMessage,
  startNumber,
}: Props) => {
  const [messages] = useAtom(IndexStore.messages);
  const columnHelper = createColumnHelper<Message>();
  const columns = [
    columnHelper.display({
      cell: (info) => `${startNumber + info.row.index}`,
      header: 'No',
    }),
    columnHelper.accessor('senderName', {
      cell: (info) => info.getValue(),
      id: 'senderName',
      header: 'Sender',
    }),
    columnHelper.accessor('subject', {
      cell: (info) => info.getValue() || 'No Subject',
      id: 'subject',
      header: 'Subject',
    }),
    columnHelper.accessor('receivedDateTime', {
      cell: (info) => (
        <>{format(new Date(info.getValue()), 'dd MMM yyyy, kk:mm')}</>
      ),
      header: 'Received Date',
    }),
    columnHelper.accessor('savedAs', {
      cell: (info) => info.getValue(),
      header: 'Saved As',
    }),
  ];

  const table = useReactTable({
    data: messages,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onMessageClick = async (message: Message) => {
    setSelectedMessage(message);
    setOpenMessageModal(true);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full">
          <div className="max-h-[40rem] overflow-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 relative">
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
                      There are currently no messages
                    </td>
                  </tr>
                )}

                {table.getRowModel().rows.map((row, idx) => {
                  return (
                    <tr
                      className={clsx(
                        'transition duration-300 ease-in-out hover:bg-sky-100 cursor-pointer',
                        {
                          'bg-white': idx % 2 === 0,
                          'bg-gray-50': idx % 2 !== 0,
                          'text-red-500':
                            row.original.savedAs === MESSAGE_TYPE.JUNK,
                        }
                      )}
                      onClick={() => onMessageClick(row.original)}
                      key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={clsx(
                            'px-6 py-4 whitespace-nowrap text-sm font-medium truncate',
                            {
                              'max-w-[16rem]': cell.column.id === 'senderName',
                            },
                            { 'max-w-[32rem]': cell.column.id === 'subject' }
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
  );
};

export default MessagesTable;
