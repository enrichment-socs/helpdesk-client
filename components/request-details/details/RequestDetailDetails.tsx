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
import RequestDetailConversations from './RequestDetailConversations';
import RequestDetailProperties from './RequestDetailProperties';

type Props = {
  conversationId: string;
}

const RequestDetailDetails: React.FC<Props> = ({ conversationId }) => {
  const conversationsData = [
    {
      id: 1,
      sender: 'Dummy User 1',
      sent_date: '2020-01-01',
      recipient_email: 'enrichment.socs@binus.edu',
      subject: 'Dummy Subject 1',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem ex aliquid deserunt sint itaque autem tenetur, velit odit natus. Iure aliquid ab natus provident amet voluptate est neque consequuntur harum!',
    },
    {
      id: 2,
      sender: 'Dummy User 2',
      sent_date: '2020-07-07',
      recipient_email: 'dummy@dummy.com',
      subject: 'Dummy Subject 2',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem ex aliquid deserunt sint itaque autem tenetur, velit odit natus. Iure aliquid ab natus provident amet voluptate est neque consequuntur harum!',
    },
  ];

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user.accessToken);

  const [outlookMessages, setOutlookMessages] = useState<OutlookMessage[]>(null);
  // const [attachments, setAttachments] = useState<OutlookMessageAttachmentValue[]>([]);

  const fetchMessages = async () => {
    // const messageResult = await graphApiService.getMessageById(id);

    // const firstMessageFromThisConversation = await graphApiService.getFirstMessageByConversation(messageResult.conversationId);

    // const bodyContent = messageResult.body.content;
    // const contentIds = bodyContent.match(CONTENT_ID_REGEX);

    // if(contentIds || messageResult.hasAttachments)
    // {
    //   const messageAttachment = await graphApiService.getmessageAttah
    // }

    const messagesByConversation = await graphApiService.getMessagesByConversation(conversationId);
    setOutlookMessages(messagesByConversation);
  }

  useEffect(() => {
    fetchMessages();
  }, [])

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
                    {outlookMessages ? <RequestDetailConversationHeader message={outlookMessages[0]}/> : <SkeletonLoading width="100%" />}
                    {/* <div className="pt-2">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Repellendus quia itaque fuga temporibus cupiditate
                      laudantium provident perspiciatis qui eius, soluta rem,
                      repellat nam adipisci mollitia nostrum similique? Quo,
                      consequatur libero?
                    </div> */}
                    {outlookMessages ? <RequestDetailConversationBody message={outlookMessages[0]} /> : <MultiLineSkeletonLoading width="100%" />}
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
                  {conversationsData.map((conversation) => (
                    <RequestDetailConversations
                      key={conversation.id}
                      conversationData={conversation}
                    />
                  ))}
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
