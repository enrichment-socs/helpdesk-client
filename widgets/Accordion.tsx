import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export const Accordion = ({ title, children, defaultOpen = false }: Props) => {
  return (
    <Disclosure defaultOpen={defaultOpen} as="div" className="mt-6">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`${
              open ? 'rounded-t' : 'rounded'
            } flex justify-between w-full px-4 py-2 text-sm border border-gray-300 font-medium text-left text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}>
            <span className="font-bold">{title}</span>
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
            <Disclosure.Panel className="p-4 border-r border-l border-b border-gray-300 text-sm text-gray-800">
              {children}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};
