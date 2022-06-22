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
import toast from 'react-hot-toast';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import { CONTENT_ID_REGEX } from '../../shared/constants/regex';
import MessageDetailModalAction from './MessageDetailModalAction';
import MessageDetailModalHeader from './MessageDetailModalHeader';
import MessageDetailModalBody from './MessageDetailModalBody';
import { If, Then } from 'react-if';
import { Message } from '../../models/Message';
import { OutlookMessageClientHelper } from '../../shared/libs/outlook-message-client-helper';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<Message>>;
  message: Message;
};

const MessageDetailModal = ({
  isOpen,
  setIsOpen,
  setMessage,
  message,
}: Props) => {
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user.accessToken);

  const [outlookMessage, setOutlookMessage] = useState<OutlookMessage>(null);

  const [
    outlookMessagesFromThisConversation,
    setOutlookMessagesFromThisConversation,
  ] = useState<OutlookMessage[]>([]);

  const [attachmentArrays, setAttachmentArrays] = useState<
    OutlookMessageAttachmentValue[][]
  >([]);

  const close = () => {
    setIsOpen(false);
    setOutlookMessage(null);
    setMessage(null);
    setOutlookMessagesFromThisConversation([]);
    setAttachmentArrays([]);
  };

  useEffect(() => {
    if (message?.messageId) {
      const wrapper = new ClientPromiseWrapper(toast);
      wrapper.handle(fetchMessage());
    }
  }, [message]);

  const fetchMessage = async () => {
    const messagesByConversation =
      await graphApiService.getMessagesByConversation(message?.conversationId);

    for (let i = 0; i < messagesByConversation.length; i++) {
      const useUniqueBody = i !== 0;
      const message = messagesByConversation[i];
      const bodyContent = useUniqueBody
        ? message.uniqueBody.content
        : message.body.content;
      const contentIds = bodyContent.match(CONTENT_ID_REGEX);

      let attachments = [];
      if (message.hasAttachments || contentIds) {
        const messageAttachment = await graphApiService.getMessageAttachments(
          message.id
        );

        const helper = new OutlookMessageClientHelper(message);
        let processedContent = helper.replaceBodyImageWithCorrectSource(
          messageAttachment.value,
          useUniqueBody
        );

        if (useUniqueBody) message.uniqueBody.content = processedContent;
        else message.body.content = processedContent;

        attachments = messageAttachment.value;
      }

      setAttachmentArrays((prev) => [...prev, attachments]);
    }

    setOutlookMessagesFromThisConversation(messagesByConversation);
    setOutlookMessage(
      messagesByConversation.find((m) => m.id === message.messageId)
    );
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

                <div className="mt-2 px-6 pb-6">
                  <MessageDetailModalHeader message={outlookMessage} />
                  <MessageDetailModalBody
                    outlookMessages={outlookMessagesFromThisConversation}
                    attachmentArrays={attachmentArrays}
                    currentOutlookMessage={outlookMessage}
                  />

                  <If
                    condition={
                      outlookMessage !== null && outlookMessage !== undefined
                    }>
                    <Then>
                      <MessageDetailModalAction
                        onClose={close}
                        message={message}
                        firstOutlookMessageFromConversation={
                          outlookMessagesFromThisConversation[0]
                        }
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
