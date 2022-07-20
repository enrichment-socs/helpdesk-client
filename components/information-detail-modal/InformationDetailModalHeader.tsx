import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon, LinkIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';
import { OutlookMessage } from '../../models/OutlookMessage';
import MultiLineSkeletonLoading from '../../widgets/MultiLineSkeletonLoading';
import SkeletonLoading from '../../widgets/SkeletonLoading';

type Props = {
  message: OutlookMessage;
};

export default function InformationDetailModalHeader({ message }: Props) {
  const getSubjectInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;
    return message.subject || 'No Subject';
  };

  const getSenderInfo = () => {
    return message ? (
      message.sender.emailAddress.address
    ) : (
      <SkeletonLoading width="100%" />
    );
  };

  const getToRecipientsInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;

    const recipients = message.toRecipients
      .map((recipient) => recipient.emailAddress.address)
      .join(', ');

    return recipients || '-';
  };

  const getCcRecipientsInfo = () => {
    if (!message) return <SkeletonLoading width="100%" />;

    const recipients = message.ccRecipients
      .map((recipient) => recipient.emailAddress.address)
      .join(', ');

    return recipients || '-';
  };

  const getReceivedDateTimeInfo = () => {
    return message ? (
      format(new Date(message.receivedDateTime), 'dd MMM yyy, kk:mm')
    ) : (
      <SkeletonLoading width="100%" />
    );
  };

  const getWebLink = () => {
    return message ? (
      <a
        href={message.webLink}
        className="underline text-blue-600 flex items-center space-x-1"
        target="_blank"
        rel="noreferrer">
        <LinkIcon className="w-4 h-4 text-gray-700" />
        <span className="block">Open in Outlook Web</span>{' '}
      </a>
    ) : (
      <SkeletonLoading width="100%" />
    );
  };

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
            <span className="font-bold">Informations</span>
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
                <ul className="bg-white border border-gray-200 text-gray-900">
                  <li className="flex flex-col md:flex-row text-center px-6 border-b border-gray-200 w-full">
                    <div className="font-semibold w-full md:w-1/4 py-2 border-b md:border-r border-gray-200">
                      Subject
                    </div>
                    <div className="w-full md:w-3/4 py-2 ml-4">
                      {getSubjectInfo()}
                    </div>
                  </li>

                  <li className="flex flex-col md:flex-row text-center px-6 border-b border-gray-200 w-full">
                    <div className="font-semibold w-full md:w-1/4 py-2 border-b md:border-r border-gray-200">
                      From
                    </div>
                    <div className="w-full md:w-3/4 py-2 ml-4">
                      {getSenderInfo()}
                    </div>
                  </li>

                  <li className="flex flex-col md:flex-row text-center px-6 border-b border-gray-200 w-full">
                    <div className="font-semibold w-full md:w-1/4 py-2 border-b md:border-r border-gray-200">
                      To
                    </div>
                    <div className="w-full md:w-3/4 py-2 ml-4">
                      {getToRecipientsInfo()}
                    </div>
                  </li>

                  <li className="flex flex-col md:flex-row text-center px-6 border-b border-gray-200 w-full">
                    <div className="font-semibold w-full md:w-1/4 py-2 border-b md:border-r border-gray-200">
                      Cc
                    </div>
                    <div className="w-full md:w-3/4 py-2 ml-4">
                      {getCcRecipientsInfo()}
                    </div>
                  </li>

                  <li className="flex flex-col md:flex-row text-center px-6 border-b border-gray-200 w-full">
                    <div className="font-semibold w-full md:w-1/4 py-2 border-b md:border-r border-gray-200">
                      Received at
                    </div>
                    <div className="w-full md:w-3/4 py-2 ml-4">
                      {getReceivedDateTimeInfo()}
                    </div>
                  </li>

                  <li className="flex flex-col md:flex-row text-center px-6 w-full">
                    <div className="font-semibold w-full md:w-1/4 py-2 border-b md:border-r border-gray-200">
                      Web Link
                    </div>
                    <div className="w-full md:w-3/4 py-2 ml-4">
                      {getWebLink()}
                    </div>
                  </li>
                </ul>
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
