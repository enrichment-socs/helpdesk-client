import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';
import { MutableRefObject } from 'react';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../../models/OutlookMessageAttachment';
import SkeletonLoading from '../../../widgets/SkeletonLoading';
import TicketDetailConversationBody from './TicketDetailConversationBody';
import TicketDetailConversationHeader from './TicketDetailConversationHeader';

type Props = {
  message: OutlookMessage;
  attachments: OutlookMessageAttachmentValue[];
  defaultOpen?: boolean;
  useUniqueBody?: boolean;
  showControl?: boolean;
  replyComponentRef?: MutableRefObject<HTMLFormElement>;
};

const TicketDetailConversation = ({
  message,
  attachments,
  defaultOpen = false,
  useUniqueBody = true,
  showControl = false,
  replyComponentRef = null,
}: Props) => {
  const getSenderInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;

    const sender = message.sender?.emailAddress?.address;

    return sender || '-';
  };

  const getReceivedDateTimeInfo = () => {
    return message ? (
      format(new Date(message.receivedDateTime), 'dd MMM yyy, kk:mm')
    ) : (
      <SkeletonLoading width="100%" />
    );
  };

  return (
    <Disclosure defaultOpen={defaultOpen} as="div" className="mt-2">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`${open ? 'rounded-t' : 'rounded'} ${
              defaultOpen
                ? 'bg-primary hover:bg-primary-dark text-white'
                : 'text-gray-900 bg-gray-200 hover:bg-gray-300'
            } flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}>
            <span className="font-bold truncate">{getSenderInfo()}</span>
            <div className="flex">
              <span className="font-normal text-xs hidden md:block">
                {getReceivedDateTimeInfo()}
              </span>
              <ChevronUpIcon
                className={`${open ? 'transform rotate-180' : ''} w-5 h-5 ml-7`}
              />
            </div>
          </Disclosure.Button>
          <Transition
            enter="transition duration-300 ease-in-out"
            enterFrom="transform scale-50 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-300 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-50 opacity-0">
            <Disclosure.Panel className="text-sm text-gray-500">
              <div className="divide-y border border-gray-200 p-4">
                <TicketDetailConversationHeader message={message} />
                <TicketDetailConversationBody
                  message={message}
                  attachments={attachments}
                  useUniqueBody={useUniqueBody}
                  showControl={showControl}
                  replyComponentRef={replyComponentRef}
                />
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default TicketDetailConversation;
