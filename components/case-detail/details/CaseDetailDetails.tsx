import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../../models/OutlookMessageAttachment';
import MultiLineSkeletonLoading from '../../../widgets/MultiLineSkeletonLoading';
import SkeletonLoading from '../../../widgets/SkeletonLoading';
import CaseDetailConversationBody from './CaseDetailConversationBody';
import CaseDetailConversationHeader from './CaseDetailConversationHeader';
import CaseDetailProperties from './CaseDetailProperties';
import CaseDetailConversation from './CaseDetailConversation';
import { Message } from '../../../models/Message';
import { Case } from '../../../models/Case';

type Props = {
  outlookMessages: OutlookMessage[];
  attachmentsArrays: OutlookMessageAttachmentValue[][];
  currCase: Case;
};

const CaseDetailDetails: React.FC<Props> = ({
  outlookMessages,
  attachmentsArrays,
  currCase,
}) => {
  return (
    <div>
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
                    {outlookMessages ? (
                      <CaseDetailConversationHeader
                        message={outlookMessages[0]}
                      />
                    ) : (
                      <SkeletonLoading width="100%" />
                    )}

                    {outlookMessages ? (
                      <CaseDetailConversationBody
                        useUniqueBody={false}
                        message={outlookMessages[0]}
                        attachments={attachmentsArrays[0]}
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
                      outlookMessages
                        .slice(1)
                        .map((message, idx) => (
                          <CaseDetailConversation
                            key={message.id}
                            message={message}
                            attachments={attachmentsArrays[idx]}
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

        <Disclosure defaultOpen as="div" className="mt-2">
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
                  <CaseDetailProperties
                    currCase={currCase}
                    outlookMessage={outlookMessages ? outlookMessages[0] : null}
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

export default CaseDetailDetails;
