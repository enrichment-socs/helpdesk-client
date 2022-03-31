import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { semestersAtom } from '../../atom';
import { Semester } from '../../models/Semester';

export default function SemesterListBox() {
  const [semesters] = useAtom(semestersAtom);
  const [selected, setSelected] = useState(
    semesters ? semesters.find((s) => s.isActive) ?? null : null,
  );

  const getDescription = (semester: Semester | null) => {
    if (!semester) return 'No Semester';
    return `${semester.type} Semester ${semester.startYear}/${semester.endYear}`;
  };

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className='relative mt-1'>
        <Listbox.Button className='w-64 relative cursor-pointer border border-gray-200 w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-sm cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-primary focus-visible:ring-offset-2 focus-visible:border-primary sm:text-sm'>
          <span className='block truncate text-base'>
            {getDescription(selected)}
          </span>
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
            {semesters?.map((semester, semesterIdx) => (
              <Listbox.Option
                key={semesterIdx}
                className={({ active }) =>
                  `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                    active ? 'text-white bg-primary' : 'text-gray-900'
                  }`
                }
                value={semester}>
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}>
                      {getDescription(semester)}
                    </span>
                    {selected ? (
                      <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600'>
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
