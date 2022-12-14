import { MailIcon, RefreshIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { SessionUser } from '../../models/SessionUser';
import { GraphApiService } from '../../services/GraphApiService';
import MessageDetailModal from '../message-detail-modal/MessageDetailModal';
import CustomPaginator from '../../widgets/CustomPaginator';
import { MessageService } from '../../services/MessageService';
import { Message } from '../../models/Message';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import IndexStore from '../../stores';
import UnmarkedMessagesTable from './UnmarkedMessageTable';
import ErrorAlert from '../../widgets/ErrorAlert';

type Props = {
  take: number;
};

export default function UnmarkedMessageContainer({ take }: Props) {
  const [totalCount, setTotalCount] = useAtom(IndexStore.unmarkedMessagesCount);
  const [skip, setSkip] = useAtom(IndexStore.unmarkedSkipCount);

  const [, setMessages] = useAtom(IndexStore.unmarkedMessages);
  const [isSync, setIsSync] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);

  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message>(null);

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user.accessToken);
  const messageService = new MessageService(user.accessToken);

  const syncAndGetMessages = async () => {
    await graphApiService.syncMessages();
    const { messages, count } = await messageService.getUnmarkedMessages(
      take,
      0
    );
    return { messages, count };
  };

  const handleSyncMessages = async () => {
    setIsSync(true);
    const { messages, count } = await toast.promise(syncAndGetMessages(), {
      loading: 'Syncing Messages',
      success: 'Messages synced',
      error: (e) => e.toString(),
    });
    setMessages(messages);
    setTotalCount(count);
    setPageNumber(1);
    setSkip(0);
    setThreeFirstPageNumber([1, 2, 3]);
    setIsSync(false);
  };

  const fetchMessages = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);
    const { messages } = await wrapper.handle(
      messageService.getUnmarkedMessages(take, skip)
    );
    return messages;
  };

  return (
    <>
      <MessageDetailModal
        isOpen={openMessageModal}
        setIsOpen={setOpenMessageModal}
        setMessage={setSelectedMessage}
        message={selectedMessage}
      />
      <div className="ml-2 mt-5 p-2 border-2 rounded divide-y">
        <div className="flex justify-between">
          <div className="text-lg font-bold mb-3 flex items-center text-red-500">
            <MailIcon className="h-5 w-5" />
            <span className="ml-3">Unmarked Messages</span>
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
          <ErrorAlert className="mt-2">
            <p className="text-red-500">
              Messages listed here are messages that have not been marked 7 days
              after it was received.
            </p>
            <p className="text-red-500">
              Please mark the messages below as <strong>Ticket</strong>,{' '}
              <strong>Information</strong>, or <strong>Junk</strong>{' '}
              immediately.
            </p>
          </ErrorAlert>
          <UnmarkedMessagesTable
            startNumber={skip + 1}
            setOpenMessageModal={setOpenMessageModal}
            setSelectedMessage={setSelectedMessage}
          />

          <CustomPaginator
            take={take}
            skip={skip}
            totalCount={totalCount}
            setSkip={setSkip}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            threeFirstPageNumbers={threeFirstPageNumber}
            setThreeFirstPageNumbers={setThreeFirstPageNumber}
            fetchItem={fetchMessages}
            setItem={setMessages}
          />
        </div>
      </div>
    </>
  );
}
