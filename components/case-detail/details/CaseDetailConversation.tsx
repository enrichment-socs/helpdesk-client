import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../../models/OutlookMessageAttachment';
import SkeletonLoading from '../../../widgets/SkeletonLoading';
import CaseDetailConversationBody from './CaseDetailConversationBody';
import CaseDetailConversationHeader from './CaseDetailConversationHeader';

// type Prop = {
//   conversationData: {
//     id: number;
//     sender: string;
//     sent_date: string;
//     recipient_email: string;
//     subject: string;
//     content: string;
//   };
// };

type Props = {
  message: OutlookMessage;
  attachments: OutlookMessageAttachmentValue[];
};

const CaseDetailConversation = ({ message, attachments }: Props) => {
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

  const getToRecipientsInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;

    const recipients = message.toRecipients
      .map((recipient, idx) => recipient.emailAddress.address)
      .join(', ');

    return recipients || '-';
  };

  const getSubjectInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;

    const subject = message.subject || 'No Subject';

    return subject || '-';
  };

  return (
    <Disclosure as="div" className="mt-2">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`${
              open ? 'rounded-t' : 'rounded'
            } flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}>
            <span className="font-bold">{getSenderInfo()}</span>
            <div className="flex">
              <span className="text-gray-500 font-normal text-xs">
                {getReceivedDateTimeInfo()}
              </span>
              <ChevronUpIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 ml-7 text-slate-500`}
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
                <CaseDetailConversationHeader message={message} />
                <CaseDetailConversationBody
                  message={message}
                  attachments={attachments}
                />
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default CaseDetailConversation;
