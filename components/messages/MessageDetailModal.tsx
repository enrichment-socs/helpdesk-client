import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { SetStateAction } from "jotai";
import { Dispatch, Fragment } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  conversationIndex: string;
};

const MessageDetailModal = ({
  isOpen,
  setIsOpen,
  conversationIndex,
}: Props) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          <div
            className="min-h-screen px-4 text-center"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              style={{ background: "rgba(0,0,0,0.6)" }}
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded">
                <div className="text-lg items-center flex bg-gray-100 justify-between px-6 py-3">
                  <Dialog.Title
                    as="h3"
                    className="font-medium leading-6 text-gray-900"
                  >
                    Message Detail
                  </Dialog.Title>

                  <button onClick={() => setIsOpen(false)}>
                    <XIcon className="w-5 h-5 hover:fill-red-500" />
                  </button>
                </div>

                <div className="mt-2 p-6">
                  <table className="border w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="px-6 py-3 w-20 font-bold border-r">
                          Email ID
                        </td>
                        <td className="px-6 py-3 break-all">
                          91a9132c-bfbe-11ec-9d64-0242ac120002
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3 w-20 font-bold border-r">
                          Conversation ID
                        </td>
                        <td className="px-6 py-3 break-all">
                          91a9132c-bfbe-11ec-9d64-0242ac120002
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3 w-20 font-bold border-r">
                          Conversation Index
                        </td>
                        <td className="px-6 py-3 break-all">
                          91a9132c-bfbe-11ec-9d64-0242ac120002
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3 w-20 font-bold border-r">
                          Sender Email
                        </td>
                        <td className="px-6 py-3 break-all">test@email.com</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3 w-20 font-bold border-r">
                          Sender Name
                        </td>
                        <td className="px-6 py-3 break-all">Dummy Name</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3 font-bold border-r">
                          Subject
                        </td>
                        <td className="px-6 py-3 break-all">Test Subject</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3 font-bold border-r">Body</td>
                        <td className="px-6 py-3 break-all">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Exercitationem maiores blanditiis illo deserunt
                          itaque nihil ipsum mollitia ullam, quae sapiente amet
                          adipisci quam expedita possimus! Aliquam sint quae
                          autem cum?
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3 font-bold border-r">
                          Sent Date
                        </td>
                        <td className="px-6 py-3 break-all">2022-04-19</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3 font-bold border-r">
                          Received Date
                        </td>
                        <td className="px-6 py-3 break-all">2022-04-19</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3 font-bold border-r">
                          Web Link
                        </td>
                        <td className="px-6 py-3 break-all">Dummy Link</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-5">
                    <div className="font-bold text-xl">
                      Select Message Category
                    </div>
                    <select
                      className="bg-gray-50 border-gray-300 text-gray-700 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-3 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="category"
                      id="category"
                    >
                      <option value="Category 1">Category 1</option>
                      <option value="Category 2">Category 2</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded text-sm px-3 py-1.5 mt-3 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-700"
                    >
                      Submit Message
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MessageDetailModal;
