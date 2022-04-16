import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

type Prop = {
  conversationData: {
    id: number;
    sender: string;
    sent_date: string;
    recipient_email: string;
    subject: string;
    content: string;
  };
};

const RequestDetailConversations = ({ conversationData }: Prop) => {
  return (
    <Disclosure as="div" className="mt-2">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75">
            <span className="font-bold">{conversationData.sender}</span>
            <span className="text-gray-500 font-normal text-xs">
              {conversationData.sent_date}
            </span>
            <ChevronUpIcon
              className={`${
                open ? "transform rotate-180" : ""
              } w-5 h-5 text-slate-500`}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-300 ease-in-out"
            enterFrom="transform scale-50 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-300 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-50 opacity-0"
          >
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              <div className="divide-y">
                <div className="pb-2">
                  <div>
                    <span className="font-bold">To:</span>
                    <span className="ml-3">
                      {conversationData.recipient_email}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">Subject:</span>
                    <span className="ml-3">{conversationData.subject}</span>
                  </div>
                </div>
                <div className="pt-5">{conversationData.content}</div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default RequestDetailConversations;
