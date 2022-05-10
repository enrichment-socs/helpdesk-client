import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { format } from 'date-fns';
import { SetStateAction } from 'jotai';
import { useSession } from 'next-auth/react';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { OutlookMessage } from '../../models/OutlookMessage';
import { SessionUser } from '../../models/SessionUser';
import { GraphApiService } from '../../services/GraphApiService';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  messageId: string;
  conversationId: string;
};

const MessageDetailModal = ({
  isOpen,
  setIsOpen,
  messageId,
  conversationId,
}: Props) => {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const [message, setMessage] = useState<OutlookMessage>(null);

  const close = () => {
    setIsOpen(false);
    setMessage(null);
  };

  const fetchMessage = async () => {
    const result = await GraphApiService.getMessageById(
      messageId,
      user.accessToken
    );
    setMessage(result);
    console.log({ result });
  };

  useEffect(() => {
    if (messageId) {
      fetchMessage();
    }
  }, [messageId, conversationId]);

  const getSenderInfo = () => {
    return message ? message.sender.emailAddress.address : 'Loading...';
  };

  const getToRecipientsInfo = () => {
    if (!message) return 'Loading...';

    const recipients = message.toRecipients
      .map((recipient) => recipient.emailAddress.address)
      .join(', ');

    return recipients || '-';
  };

  const getCcRecipientsInfo = () => {
    if (!message) return 'Loading...';

    const recipients = message.ccRecipients
      .map((recipient) => recipient.emailAddress.address)
      .join(', ');

    return recipients || '-';
  };

  const getReceivedDateTimeInfo = () => {
    return message
      ? format(new Date(message.receivedDateTime), 'dd MMM yyy, kk:mm')
      : 'Loading...';
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsOpen(false)}>
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
                  <div className="border border-gray-300 rounded">
                    <div className="bg-gray-300 text-gray-700 p-2">
                      Information
                    </div>

                    <ul className="bg-white border border-gray-200 text-gray-900">
                      <li className="flex px-6 border-b border-gray-200 w-full">
                        <div className="w-1/4 py-2 border-r border-gray-200">
                          Subject
                        </div>
                        <div className="w-3/4 py-2 ml-4">{message.subject}</div>
                      </li>

                      <li className="flex px-6 border-b border-gray-200 w-full">
                        <div className="w-1/4 py-2 border-r border-gray-200">
                          From
                        </div>
                        <div className="w-3/4 py-2 ml-4">{getSenderInfo()}</div>
                      </li>

                      <li className="flex px-6 border-b border-gray-200 w-full">
                        <div className="w-1/4 py-2 border-r border-gray-200">
                          To
                        </div>
                        <div className="w-3/4 py-2 ml-4">
                          {getToRecipientsInfo()}
                        </div>
                      </li>

                      <li className="flex px-6 border-b border-gray-200 w-full">
                        <div className="w-1/4 py-2 border-r border-gray-200">
                          Cc
                        </div>
                        <div className="w-3/4 py-2 ml-4">
                          {getCcRecipientsInfo()}
                        </div>
                      </li>

                      <li className="flex px-6 w-full">
                        <div className="w-1/4 py-2 border-r border-gray-200">
                          Received at
                        </div>
                        <div className="w-3/4 py-2 ml-4">
                          {getReceivedDateTimeInfo()}
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-300 rounded mt-4">
                    <div className="bg-gray-300 text-gray-700 p-2">Content</div>
                    <div className="p-4">
                      {!message ? (
                        'Loading...'
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: message.body.content,
                          }}></div>
                      )}
                    </div>
                  </div>

                  <div className="border border-gray-300 rounded mt-8">
                    <div className="bg-gray-300 text-gray-700 p-2">Action</div>
                    <div className="p-4">lorem ipsum</div>
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

export default MessageDetailModal;
