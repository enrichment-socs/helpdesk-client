import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { OutlookMessage } from '../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../models/OutlookMessageAttachment';
import MessageAttachmentList from '../../widgets/MessageAttachmentList';
import MultiLineSkeletonLoading from '../../widgets/MultiLineSkeletonLoading';

type Props = {
  message: OutlookMessage;
  attachments: OutlookMessageAttachmentValue[];
};

export default function InformationDetailModalBody({
  message,
  attachments,
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
            <span className="font-bold">Content</span>
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
              {message ? (
                <div>
                  <div
                    className="max-h-[42rem] overflow-auto"
                    dangerouslySetInnerHTML={{
                      __html: message.body.content,
                    }}></div>

                  {message.hasAttachments && (
                    <div className="border-t border-gray-300 mt-4">
                      <h3 className="font-semibold text-sm mt-4">
                        Attachments
                      </h3>
                      <MessageAttachmentList attachments={attachments} />
                    </div>
                  )}
                </div>
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
