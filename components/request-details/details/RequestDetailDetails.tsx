import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../../models/OutlookMessageAttachment';
import { SessionUser } from '../../../models/SessionUser';
import { GraphApiService } from '../../../services/GraphApiService';
import { CONTENT_ID_REGEX } from '../../../shared/constants/regex';
import MultiLineSkeletonLoading from '../../../widgets/MultiLineSkeletonLoading';
import SkeletonLoading from '../../../widgets/SkeletonLoading';
import RequestDetailConversationBody from './RequestDetailConversationBody';
import RequestDetailConversationHeader from './RequestDetailConversationHeader';
import RequestDetailProperties from './RequestDetailProperties';
import RequestDetailConversation from './RequestDetailConversation';

type Props = {
  outlookMessages: OutlookMessage[];
  attachmentsArrays: OutlookMessageAttachmentValue[][];
};

const RequestDetailDetails: React.FC<Props> = ({ outlookMessages, attachmentsArrays }) => {

  return (
    <div>
      <div className="w-full rounded-2xl">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-sky-900 bg-sky-100 rounded-lg hover:bg-sky-200 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75">
                <span className="font-bold">Description</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-sky-500`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-300 ease-in-out"
                enterFrom="transform scale-50 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-300 ease-in"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-50 opacity-0">
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-700">
                  <div className="divide-y">
                    {outlookMessages ? (
                      <RequestDetailConversationHeader
                        message={outlookMessages[0]}
                      />
                    ) : (
                      <SkeletonLoading width="100%" />
                    )}
                    
                    {outlookMessages ? (
                      <RequestDetailConversationBody
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
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-sky-900 bg-sky-100 rounded-lg hover:bg-sky-200 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75">
                <span className="font-bold">Conversations</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-sky-500`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-300 ease-in-out"
                enterFrom="transform scale-50 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-300 ease-in"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-50 opacity-0">
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  {outlookMessages ? (outlookMessages.length === 1 ? (
                    <span>There is no conversation yet.</span>
                  ) : (
                    outlookMessages.slice(1).map((message, idx) => (
                      <RequestDetailConversation
                        key={message.id}
                        message={message}
                        attachments={attachmentsArrays[idx]}
                      />
                    ))
                  )) : (<SkeletonLoading width="100%"/>)}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>

        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-sky-900 bg-sky-100 rounded-lg hover:bg-sky-200 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75">
                <span className="font-bold">More Properties</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-sky-500`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-300 ease-in-out"
                enterFrom="transform scale-50 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-300 ease-in"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-50 opacity-0">
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  <RequestDetailProperties />
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default RequestDetailDetails;
