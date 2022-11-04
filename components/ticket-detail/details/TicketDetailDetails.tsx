import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import MultiLineSkeletonLoading from '../../../widgets/MultiLineSkeletonLoading';
import TicketDetailConversationBody from './TicketDetailConversationBody';
import TicketDetailConversationHeader from './TicketDetailConversationHeader';
import TicketDetailProperties from './TicketDetailProperties';
import TicketDetailConversation from './TicketDetailConversation';
import TicketDetailReply from './TicketDetailReply';
import { useRef } from 'react';
import { useAtom } from 'jotai';
import TicketDetailStore from '../../../stores/tickets/[id]';
import ResolutionConfirmationModal from './ResolutionConfirmationModal';

const TicketDetailDetails = () => {
  const replyComponentRef = useRef(null);

  const [outlookMessages] = useAtom(TicketDetailStore.outlookMessages);
  const [attachmentsArrays] = useAtom(TicketDetailStore.attachmentsArray);
  const [ticket] = useAtom(TicketDetailStore.ticket);
  const [resolution] = useAtom(TicketDetailStore.resolution);

  return (
    <div>
      <ResolutionConfirmationModal />

      <div className="w-full rounded-2xl">
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`${
                  open ? 'rounded-t' : 'rounded'
                } flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}>
                <span className="font-bold">Description</span>
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
                <Disclosure.Panel className="text-sm text-gray-700">
                  <div className="divide-y border border-gray-300 p-4">
                    {outlookMessages && (
                      <TicketDetailConversationHeader
                        message={outlookMessages[0]}
                      />
                    )}

                    {outlookMessages ? (
                      <TicketDetailConversationBody
                        useUniqueBody={false}
                        message={outlookMessages[0]}
                        attachments={attachmentsArrays[0]}
                        canBeReplied={true}
                        canBeMarkedAsResolution={false}
                        replyComponentRef={replyComponentRef}
                      />
                    ) : (
                      <MultiLineSkeletonLoading width="100%" />
                    )}
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>

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
                  {outlookMessages ? (
                    outlookMessages.length === 1 ? (
                      <span>There is no conversation yet.</span>
                    ) : (
                      outlookMessages.slice(1).map((message, idx) => {
                        const realIdx = idx + 1;
                        return (
                          <TicketDetailConversation
                            key={message.id}
                            message={message}
                            attachments={attachmentsArrays[realIdx]}
                            canBeReplied
                            canBeMarkedAsResolution
                            replyComponentRef={replyComponentRef}
                          />
                        );
                      })
                    )
                  ) : (
                    <MultiLineSkeletonLoading width="100%" />
                  )}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>

        <div ref={replyComponentRef}>
          <Disclosure as="div" defaultOpen className="mt-2">
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`${
                    open ? 'rounded-t' : 'rounded'
                  } flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}>
                  <span className="font-bold">Reply</span>
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
                    <TicketDetailReply />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </div>

        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`${
                  open ? 'rounded-t' : 'rounded'
                } flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}>
                <span className="font-bold">More Properties</span>
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
                  <TicketDetailProperties
                    ticket={ticket}
                    outlookMessage={outlookMessages ? outlookMessages[0] : null}
                    resolution={resolution}
                  />
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default TicketDetailDetails;
