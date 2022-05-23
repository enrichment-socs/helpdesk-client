import { Dialog, Transition } from '@headlessui/react';
import { DownloadIcon, XIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';
import { SetStateAction } from 'jotai';
import { useSession } from 'next-auth/react';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { OutlookMessage } from '../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../models/OutlookMessageAttachment';
import { SessionUser } from '../../models/SessionUser';
import { GraphApiService } from '../../services/GraphApiService';
import { DownloadHelper } from '../../shared/libs/download-helper';
import MultiLineSkeletonLoading from '../../widgets/MultiLineSkeletonLoading';
import SkeletonLoading from '../../widgets/SkeletonLoading';
import toast from 'react-hot-toast';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import { CONTENT_ID_REGEX } from '../../shared/constants/regex';
import MessageDetailModalAction from './MessageDetailModalAction';
import MessageDetailModalHeader from './MessageDetailModalHeader';
import MessageDetailModalBody from './MessageDetailModalBody';
import { If, Then } from 'react-if';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  messageId: string;
  conversationId: string;
  setMessageId: Dispatch<SetStateAction<string>>;
};

const MessageDetailModal = ({
  isOpen,
  setIsOpen,
  messageId,
  conversationId,
  setMessageId,
}: Props) => {
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user.accessToken);

  const [message, setMessage] = useState<OutlookMessage>(null);
  const [attachments, setAttachments] = useState<
    OutlookMessageAttachmentValue[]
  >([]);

  const close = () => {
    setIsOpen(false);
    setMessage(null);
    setMessageId(null);
  };

  useEffect(() => {
    if (messageId) {
      const wrapper = new ClientPromiseWrapper(toast);
      wrapper.handle(fetchMessage());
    }
  }, [messageId, conversationId]);

  const fetchMessage = async () => {
    const messageResult = await graphApiService.getMessageById(messageId);

    const firstMessageFromThisConversation =
      await graphApiService.getFirstMessageByConversation(
        messageResult.conversationId
      );

    const bodyContent = messageResult.body.content;
    const contentIds = bodyContent.match(CONTENT_ID_REGEX);

    if (contentIds || messageResult.hasAttachments) {
      const messageAttachment = await graphApiService.getMessageAttachments(
        messageId
      );

      let processedContent = replaceBodyImageWithCorrectSource(
        bodyContent,
        contentIds,
        messageAttachment.value
      );

      messageResult.body.content = processedContent;
      setAttachments(messageAttachment.value);
    }

    setMessage(messageResult);
  };

  const replaceBodyImageWithCorrectSource = (
    bodyContent: string,
    contentIds: string[],
    attachments: OutlookMessageAttachmentValue[]
  ) => {
    let content = bodyContent;
    attachments
      .filter(
        (att) => att.isInline && contentIds.includes(`cid:${att.contentId}`)
      )
      .forEach((attachment) => {
        content = content.replace(
          `cid:${attachment.contentId}`,
          `data:image/jpeg;base64,${attachment.contentBytes}`
        );
      });
    return content;
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={close}>
          <div
            className="min-h-screen px-4 text-center"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded">
                <div className="text-lg items-center flex bg-gray-100 justify-between px-6 py-3">
                  <Dialog.Title
                    as="h3"
                    className="font-medium leading-6 text-gray-900">
                    Message Detail
                  </Dialog.Title>

                  <button onClick={close}>
                    <XIcon className="w-5 h-5 hover:fill-red-500" />
                  </button>
                </div>

                <div className="mt-2 p-6">
                  <MessageDetailModalHeader message={message} />
                  <MessageDetailModalBody
                    message={message}
                    attachments={attachments}
                  />

                  <If condition={message !== null && message !== undefined}>
                    <Then>
                      <MessageDetailModalAction
                        onClose={close}
                        conversationId={conversationId}
                      />
                    </Then>
                  </If>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MessageDetailModal;
