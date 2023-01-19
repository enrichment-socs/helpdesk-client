import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  headerClass?: string;
};

export const Accordion = ({
  title,
  children,
  defaultOpen = false,
  headerClass = 'border border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-300',
}: Props) => {
  return (
    <Disclosure defaultOpen={defaultOpen} as="div" className="mt-6">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={clsx(
              {
                'rounded-t': open,
                rounded: !open,
              },
              headerClass,
              'flex justify-between w-full px-4 py-2 text-sm font-medium text-left focus:outline-none'
            )}>
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
