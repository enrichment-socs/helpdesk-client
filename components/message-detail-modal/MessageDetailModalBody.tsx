import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon, DownloadIcon } from '@heroicons/react/solid';
import { OutlookMessage } from '../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../models/OutlookMessageAttachment';
import MultiLineSkeletonLoading from '../../widgets/MultiLineSkeletonLoading';
import TicketDetailConversation from '../ticket-detail/details/TicketDetailConversation';

type Props = {
  currentOutlookMessage: OutlookMessage;
  outlookMessages: OutlookMessage[];
  attachmentArrays: OutlookMessageAttachmentValue[][];
};

export default function MessageDetailModalBody({
  outlookMessages,
  attachmentArrays,
  currentOutlookMessage,
}: Props) {
  return (
    <Disclosure defaultOpen as="div" className="mt-2">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`${
              open ? 'rounded-t' : 'rounded'
            } flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}>
            <span className="font-bold">Conversations</span>
            <ChevronUpIcon
              className={`${
                open ? 'transform rotate-180' : ''
              } w-5 h-5 text-gray-500`}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-300 ease-in-out"
            enterFrom="transform scale-50 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-300 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-50 opacity-0">
            <Disclosure.Panel className="p-4 border border-gray-300 text-sm text-gray-500">
              {outlookMessages && currentOutlookMessage ? (
                outlookMessages.length === 0 ? (
                  <span>There is no conversation yet.</span>
                ) : (
                  outlookMessages.map((message, idx) => (
                    <TicketDetailConversation
                      defaultOpen={message.id === currentOutlookMessage.id}
                      key={message.id}
                      message={message}
                      attachments={attachmentArrays[idx]}
                      useUniqueBody={idx !== 0}
                    />
                  ))
                )
              ) : (
                <MultiLineSkeletonLoading width="100%" />
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
