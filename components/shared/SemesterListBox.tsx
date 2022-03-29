import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

const semesters = [
  { name: 'Even Semester 2021/2022' },
  { name: 'Odd Semester 2021/2022' },
];

export default function SemesterListBox() {
  const [selected, setSelected] = useState(semesters[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className='relative mt-1'>
        <Listbox.Button className='w-60 relative cursor-pointer border border-gray-200 w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-sm cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-primary focus-visible:ring-offset-2 focus-visible:border-primary sm:text-sm'>
          <span className='block truncate text-base'>{selected.name}</span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
            <SelectorIcon
              className='w-5 h-5 text-gray-400'
              aria-hidden='true'
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
            {semesters.map((person, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                    active ? 'text-gray-200 bg-primary' : 'text-gray-900'
                  }`
                }
                value={person}>
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}>
                      {person.name}
                    </span>
                    {selected ? (
                      <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900'>
                        <CheckIcon className='w-5 h-5' aria-hidden='true' />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
