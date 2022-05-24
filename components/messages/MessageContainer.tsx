import { MailIcon, RefreshIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { SessionUser } from '../../models/SessionUser';
import { messagesAtom } from '../../pages';
import { GraphApiService } from '../../services/GraphApiService';
import MessagesTable from './MessagesTable';
import MessageDetailModal from '../message-detail-modal/MessageDetailModal';
import MessagePaginator from './MessagePaginator';
import { MessageService } from '../../services/MessageService';
import { Message } from '../../models/Message';

type Props = {
  take: number;
  skip: number;
  setSkip: Dispatch<SetStateAction<number>>;
  totalCount: number;
};

export default function MessageContainer({
  take,
  skip,
  totalCount,
  setSkip,
}: Props) {
  const [, setMessages] = useAtom(messagesAtom);
  const [isSync, setIsSync] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);

  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message>(null);
  const [selectedMessageConversationId, setSelectedMessageConversationId] =
    useState<string>(null);

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user.accessToken);
  const messageService = new MessageService(user.accessToken);

  const syncAndGetMessages = async () => {
    await graphApiService.syncMessages();
    const { messages } = await messageService.getMessages(take, 0);
    return messages;
  };

  const handleSyncMessages = async () => {
    setIsSync(true);
    const messages = await toast.promise(syncAndGetMessages(), {
      loading: 'Syncing Messages',
      success: 'Messages synced',
      error: (e) => e.toString(),
    });
    setMessages(messages);
    setPageNumber(1);
    setSkip(0);
    setThreeFirstPageNumber([1, 2, 3]);
    setIsSync(false);
  };

  return (
    <>
      <MessageDetailModal
        isOpen={openMessageModal}
        setIsOpen={setOpenMessageModal}
        messageId={selectedMessage?.messageId}
        conversationId={selectedMessageConversationId}
        setMessage={setSelectedMessage}
        savedAs={selectedMessage?.savedAs}
      />
      <div className="ml-2 mt-5 p-2 border-2 rounded divide-y">
        <div className="flex justify-between">
          <div className="text-lg font-bold mb-3 flex items-center">
            <MailIcon className="h-5 w-5" />
            <span className="ml-3">Messages</span>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSyncMessages}
              disabled={isSync}
              className={`${
                isSync ? 'bg-gray-300' : 'bg-primary hover:bg-primary-dark'
              } inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}>
              Sync <RefreshIcon className="w-4 h-4 block ml-1" />
            </button>
          </div>
        </div>
        <div className="p-1">
          <MessagesTable
            startNumber={skip + 1}
            setOpenMessageModal={setOpenMessageModal}
            setSelectedMessage={setSelectedMessage}
            setSelectedMessageConversationId={setSelectedMessageConversationId}
          />

          <MessagePaginator
            take={take}
            skip={skip}
            totalCount={totalCount}
            setSkip={setSkip}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            threeFirstPageNumbers={threeFirstPageNumber}
            setThreeFirstPageNumbers={setThreeFirstPageNumber}
          />
        </div>
      </div>
    </>
  );
}
