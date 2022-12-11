import { flexRender, Table } from '@tanstack/react-table';

type Props = {
  table: Table<any>;
};

const GeneralTable = ({ table }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 rounded">
            <table className="min-w-full divide-y divide-gray-200">
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
                      No Announcement
                    </td>
                  </tr>
                )}
                {table.getRowModel().rows.map((row, idx) => (
                  <tr
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
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

export default GeneralTable;
