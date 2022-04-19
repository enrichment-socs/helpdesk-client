import { Dispatch, SetStateAction } from "react";

const DUMMY_DATA = [
  {
    sender: "Sender 1",
    title: "Title 1",
    receivedDate: "2020-01-01",
    previewBody:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum ducimus nostrum mollitia. Asperiores officia quod adipisci laudantium alias. Sint, vitae a quaerat quas obcaecati enim totam voluptate odit? Aut, numquam?",
    emailID: "91a9132c-bfbe-11ec-9d64-0242ac120002",
    conversationID: "1b10aa5c-ab52-4ba0-bb8b-96a6217ed16b",
    conversationIndex: "6f3f7dc6-bfbe-11ec-9d64-0242ac120002",
  },
  {
    sender: "Sender 2",
    title: "Title 2",
    receivedDate: "2021-03-03",
    previewBody:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reprehenderit eveniet mollitia, praesentium excepturi, iusto aliquam culpa debitis cupiditate ad neque explicabo? Beatae tempora, impedit harum ullam fuga explicabo officia debitis!",
    emailID: "9827ae3e-bfbe-11ec-9d64-0242ac120002",
    conversationID: "a0680076-bfbe-11ec-9d64-0242ac120002",
    conversationIndex: "aa52e966-bfbe-11ec-9d64-0242ac120002",
  },
];

type Props = {
  setOpenMessageModal: Dispatch<SetStateAction<boolean>>;
  setOpenMessageIndex: Dispatch<SetStateAction<string>>;
};

const MessagesTable = ({ setOpenMessageModal, setOpenMessageIndex }: Props) => {
  const onMessageClick = (index: string) => {
    setOpenMessageIndex(index);
    setOpenMessageModal(true);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-500">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Sender
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Received Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Preview Body
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Email ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Conversation ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Conversation Index
                  </th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_DATA.map((data, index) => (
                  <tr
                    key={index}
                    className={`cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } transition duration-300 ease-in-out hover:bg-sky-100`}
                    onClick={() => onMessageClick(data.conversationIndex)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.sender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.receivedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.previewBody}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.emailID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.conversationID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.conversationIndex}
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

export default MessagesTable;
