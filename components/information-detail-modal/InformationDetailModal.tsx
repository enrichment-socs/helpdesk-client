import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
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
import { Message } from '../../models/Message';
import InformationDetailModalHeader from './InformationDetailModalHeader';
import InformationDetailModalBody from './InformationDetailModalBody';
import { Information } from '../../models/Information';
import InformationDetailModalConversations from './InformationDetailModalConversations';
import { If, Then } from 'react-if';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setInfo: Dispatch<SetStateAction<Information>>;
  info: Information;
};

const InformationDetailModal = ({
  isOpen,
  setIsOpen,
  setInfo,
  info,
}: Props) => {
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user.accessToken);

  const [outlookMessage, setOutlookMessage] = useState<OutlookMessage>(null);
  const [attachments, setAttachments] = useState<
    OutlookMessageAttachmentValue[]
  >([]);
  const [
    outlookMessagesInThisConversation,
    setOutlookMessagesInThisConversation,
  ] = useState<OutlookMessage[]>([]);

  const close = () => {
    setIsOpen(false);
    setOutlookMessage(null);
    setInfo(null);
  };

  useEffect(() => {
    if (info?.conversationId) {
      const wrapper = new ClientPromiseWrapper(toast);
      wrapper.handle(fetchInfo());
    }
  }, [info]);

  const fetchInfo = async () => {
    const messagesInConversation =
      await graphApiService.getMessagesByConversation(info.conversationId);

    const firstMessage = messagesInConversation[0];

    const bodyContent = firstMessage.body.content;
    const contentIds = bodyContent.match(CONTENT_ID_REGEX);

    if (contentIds || firstMessage.hasAttachments) {
      const messageAttachment = await graphApiService.getMessageAttachments(
        firstMessage.id
      );

      let processedContent = replaceBodyImageWithCorrectSource(
        bodyContent,
        contentIds,
        messageAttachment.value
      );

      firstMessage.body.content = processedContent;
      setAttachments(messageAttachment.value);
    }

    setOutlookMessage(firstMessage);
    setOutlookMessagesInThisConversation(messagesInConversation);
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
                  <InformationDetailModalHeader message={outlookMessage} />
                  <InformationDetailModalBody
                    message={outlookMessage}
                    attachments={attachments}
                  />

                  <If
                    condition={
                      outlookMessagesInThisConversation.slice(1).length > 0
                    }>
                    <Then>
                      <InformationDetailModalConversations
                        messages={outlookMessagesInThisConversation.slice(1)}
                      />
                    </Then>
                  </If>

                  <div className="flex justify-end space-x-2 p-4">
                    <button
                      type="button"
                      onClick={close}
                      className="inline-flex items-center px-12 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default InformationDetailModal;
