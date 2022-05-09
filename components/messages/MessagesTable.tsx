import { Dispatch, SetStateAction } from 'react';
import { Message } from '../../models/Message';

type Props = {
  setOpenMessageModal: Dispatch<SetStateAction<boolean>>;
  setOpenMessageIndex: Dispatch<SetStateAction<string>>;
  messages: Message[];
};

const MessagesTable = ({
  setOpenMessageModal,
  setOpenMessageIndex,
  messages,
}: Props) => {
  const onMessageClick = (index: string) => {
    setOpenMessageIndex(index);
    setOpenMessageModal(true);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full">
          <div className="max-h-[40rem] overflow-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 relative">
              <thead className="bg-slate-500">
                <tr>
                  <th
                    scope="col"
                    className="bg-slate-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    No
                  </th>
                  <th
                    scope="col"
                    className="bg-slate-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Sender
                  </th>
                  <th
                    scope="col"
                    className="bg-slate-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="bg-slate-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Received Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {messages.length == 0 && (
                  <tr className="text-center">
                    <td colSpan={5} className="p-4">
                      There are currently no messages
                    </td>
                  </tr>
                )}

                {messages.map((message, index) => (
                  <tr
                    key={index}
                    className={`cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } transition duration-300 ease-in-out hover:bg-sky-100`}
                    onClick={() => onMessageClick(message.conversationIndex)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {message.sender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {message.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {message.receivedDateTime}
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
