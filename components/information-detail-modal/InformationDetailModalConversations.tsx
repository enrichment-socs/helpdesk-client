import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { OutlookMessage } from '../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../models/OutlookMessageAttachment';
import MultiLineSkeletonLoading from '../../widgets/MultiLineSkeletonLoading';
import SkeletonLoading from '../../widgets/SkeletonLoading';
import TicketDetailConversation from '../ticket-detail/details/TicketDetailConversation';

type Props = {
  outlookMessages: OutlookMessage[];
  attachmentsArray: OutlookMessageAttachmentValue[][];
  loading: boolean;
};

export default function InformationDetailModalConversations({
  outlookMessages,
  attachmentsArray,
  loading,
}: Props) {
  return (
    <Disclosure
      defaultOpen
      as="div"
      className="mt-4 border border-gray-300 rounded">
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
            <Disclosure.Panel className="p-4 text-sm text-gray-500">
              {!loading && outlookMessages ? (
                outlookMessages.length === 0 ? (
                  <span>There is no conversation yet.</span>
                ) : (
                  outlookMessages.map((message, idx) => (
                    <TicketDetailConversation
                      defaultOpen={idx === 0}
                      key={message.id}
                      message={message}
                      attachments={attachmentsArray[idx]}
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
