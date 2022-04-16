import { useRouter } from "next/router";

const DUMMY_DATA = [
  {
    id: "8df2917f-aca6-4747-82b7-0735c8ea7706",
    subject: "Case 1",
    requester_name: "John Doe",
    assigned_to: "John Doe",
    due_by: "2020-01-01",
    status: "Open",
    created_at: "2020-01-01",
  },
  {
    id: "096639fa-b0bc-4dca-9177-6919dc1de92e",
    subject: "Case 2",
    requester_name: "Test 2",
    assigned_to: "Test 2",
    due_by: "2020-01-01",
    status: "Open",
    created_at: "2020-02-02",
  },
];

const RequestsTable = () => {
    
    const router = useRouter();

    const rowClickHandler = (id: string) => {
        router.push(`/requests/${id}`);
    }

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
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Requester Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Assigned To
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Due By
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_DATA &&
                  DUMMY_DATA.map((data, index) => (
                    <tr
                      key={data.id}
                      className={`cursor-pointer ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } transition duration-300 ease-in-out hover:bg-sky-100`}
                      onClick={rowClickHandler.bind(this, data.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.requester_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.assigned_to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.due_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.created_at}
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
