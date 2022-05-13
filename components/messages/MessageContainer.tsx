import { ChartBarIcon, MailIcon, RefreshIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { SessionUser } from '../../models/SessionUser';
import { messagesAtom } from '../../pages';
import { GraphApiService } from '../../services/GraphApiService';
import MessagesTable from './MessagesTable';
import MessageDetailModal from '../message-detail-modal/MessageDetailModal';

export default function MessageContainer() {
  const [, setMessages] = useAtom(messagesAtom);
  const [isSync, setIsSync] = useState(false);

  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string>(null);
  const [selectedMessageConversationId, setSelectedMessageConversationId] =
    useState<string>(null);

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user.accessToken);

  const syncAndGetMessages = async () => {
    await graphApiService.syncMessages();
    return graphApiService.getMessages();
  };

  const handleSyncMessages = async () => {
    setIsSync(true);
    const messages = await toast.promise(syncAndGetMessages(), {
      loading: 'Syncing Messages',
      success: 'Messages synced',
      error: (e) => e.toString(),
    });
    setMessages(messages);
    setIsSync(false);
  };

  return (
    <>
      <MessageDetailModal
        isOpen={openMessageModal}
        setIsOpen={setOpenMessageModal}
        messageId={selectedMessageId}
        conversationId={selectedMessageConversationId}
        setMessageId={setSelectedMessageId}
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
            setOpenMessageModal={setOpenMessageModal}
            setSelectedMessageId={setSelectedMessageId}
            setSelectedMessageConversationId={setSelectedMessageConversationId}
          />
        </div>
      </div>
    </>
  );
}
