import { format } from 'date-fns';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import { Message } from '../../models/Message';
import { SessionUser } from '../../models/SessionUser';
import { messagesAtom } from '../../pages';
import { GraphApiService } from '../../services/GraphApiService';

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
  const [messages] = useAtom(messagesAtom);
  const session = useSession();

  const onMessageClick = async (message: Message) => {
    setSelectedMessage(message);
    setOpenMessageModal(true);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full">
          <div className="max-h-[40rem] overflow-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 relative -z-10">
              <thead className="bg-gray-500">
                <tr>
                  <th
                    scope="col"
                    className="bg-gray-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    No
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Sender
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Received Date
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-500 sticky top-0 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Saved as
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
                    onClick={() => onMessageClick(message)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startNumber++}
                    </td>
                    <td className="max-w-[16rem] px-6 py-4 truncate text-sm font-medium text-gray-900">
                      {message.senderName}
                    </td>
                    <td className="max-w-[32rem] px-6 py-4 truncate text-sm text-gray-900">
                      {message.subject || 'No Subject'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(
                        new Date(message.receivedDateTime),
                        'dd MMM yyyy, kk:mm'
                      )}
                    </td>
                    <td className="px-6 py-4 truncate text-sm text-gray-900">
                      {message.savedAs}
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
