import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import RequestDetailConversations from './RequestDetailConversations';
import RequestDetailProperties from './RequestDetailProperties';

const RequestDetailDetails = () => {
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
                    <div className="pb-2">
                      To:<span className="ml-3">ithelpdesk@binus.edu</span>
                    </div>
                    <div className="pt-2">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Repellendus quia itaque fuga temporibus cupiditate
                      laudantium provident perspiciatis qui eius, soluta rem,
                      repellat nam adipisci mollitia nostrum similique? Quo,
                      consequatur libero?
                    </div>
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
