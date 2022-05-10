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
  setSelectedMessageId: Dispatch<SetStateAction<string>>;
  setSelectedMessageConversationId: Dispatch<SetStateAction<string>>;
};

const MessagesTable = ({
  setOpenMessageModal,
  setSelectedMessageId,
  setSelectedMessageConversationId,
}: Props) => {
  const [messages] = useAtom(messagesAtom);
  const session = useSession();

  const onMessageClick = async (messageId: string, conversationId: string) => {
    setSelectedMessageId(messageId);
    setSelectedMessageConversationId(conversationId);
    setOpenMessageModal(true);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full">
          <div className="max-h-[40rem] overflow-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 relative">
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
                    onClick={() =>
                      onMessageClick(message.messageId, message.conversationId)
                    }>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="max-w-[16rem] px-6 py-4 truncate text-sm font-medium text-gray-900">
                      {message.sender}
                    </td>
                    <td className="max-w-[32rem] px-6 py-4 truncate text-sm text-gray-900">
                      {message.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(
                        new Date(message.receivedDateTime),
                        'dd MMM yyyy, kk:mm'
                      )}
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
