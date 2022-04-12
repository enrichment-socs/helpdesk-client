import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { SetStateAction } from 'jotai';
import { Dispatch, Fragment, useState } from 'react';
import { Announcement } from '../../models/Announcement';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  announcement: Announcement;
};

export default function AnnouncementDetailModal({
  isOpen,
  setIsOpen,
  announcement,
}: Props) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={() => setIsOpen(false)}>
          <div
            className='min-h-screen px-4 text-center'
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className='inline-block h-screen align-middle'
              style={{ background: 'rgba(0,0,0,0.6)' }}
              aria-hidden='true'>
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <div className='inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded'>
                <div className='text-lg items-center flex bg-gray-100 justify-between px-6 py-4'>
                  <Dialog.Title
                    as='h3'
                    className='font-medium leading-6 text-gray-900'>
                    Announcement
                  </Dialog.Title>

                  <button onClick={() => setIsOpen(false)}>
                    <XIcon className='w-5 h-5' />
                  </button>
                </div>

                <div
                  className='mt-2 p-6'
                  dangerouslySetInnerHTML={{
                    __html: announcement?.body,
                  }}></div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
