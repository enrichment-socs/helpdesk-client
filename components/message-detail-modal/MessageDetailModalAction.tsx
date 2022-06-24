import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Else, If, Then } from 'react-if';
import { activeSemesterAtom, semestersAtom } from '../../atom';
import { Category } from '../../models/Category';
import { CreateTicketDto } from '../../models/dto/tickets/create-ticket.dto';
import { CreateInformationDto } from '../../models/dto/informations/create-information.dto';
import { Message } from '../../models/Message';
import { OutlookMessage } from '../../models/OutlookMessage';
import { Priority } from '../../models/Priority';
import { SessionUser } from '../../models/SessionUser';
import { User } from '../../models/User';
import { messagesAtom } from '../../pages';
import { TicketService } from '../../services/TicketService';
import { CategoryService } from '../../services/CategoryService';
import { InformationService } from '../../services/InformationService';
import { PriorityService } from '../../services/PriorityService';
import { StatusService } from '../../services/StatusService';
import { UserService } from '../../services/UserService';
import { MESSAGE_TYPE } from '../../shared/constants/message-type';
import { STATUS } from '../../shared/constants/status';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { addHours } from 'date-fns';
import ReactTooltip from 'react-tooltip';
import { DateHelper } from '../../shared/libs/date-helper';

type Props = {
  onClose: () => void;
  message: Message;
  currentOutlookMessage: OutlookMessage;
  firstOutlookMessageFromConversation: OutlookMessage;
};

const DatePicker = dynamic(import('react-datepicker'), { ssr: false }) as any;

export default function MessageDetailModalAction({
  onClose,
  message,
  firstOutlookMessageFromConversation,
  currentOutlookMessage,
}: Props) {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const [messages, setMessages] = useAtom(messagesAtom);

  const types = Object.keys(MESSAGE_TYPE).map((key) => MESSAGE_TYPE[key]);
  const [canSave, setCanSave] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [semesters] = useAtom(semestersAtom);
  const [activeSemester] = useAtom(activeSemesterAtom);

  const [selectedType, setSelectedType] = useState(types[0]);
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedPriorityId, setSelectedPriorityId] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState('');

  const getInitialDueBy = (): Date => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5);
    return DateHelper.roundUpHours(dueDate);
  };

  const [selectedDueDate, setSelectedDueDate] = useState(getInitialDueBy());

  useEffect(() => {
    const fetchInitialData = async () => {
      const categoryService = new CategoryService(user?.accessToken);
      const priorityService = new PriorityService(user?.accessToken);
      const usersService = new UserService(user?.accessToken);

      const fetchedCategories = await categoryService.getAll();
      const fetchedPriorities = await priorityService.getAll();
      const fetchedAdmins = await usersService.getUsersWithAdminRole();

      setCategories(fetchedCategories);
      setPriorities(fetchedPriorities);
      setAdmins(fetchedAdmins);

      setSelectedCategoryId(fetchedCategories[0]?.id ?? '');
      setSelectedPriorityId(fetchedPriorities[0]?.id ?? '');
      setSelectedAdminId(fetchedAdmins[0]?.id ?? '');
      setSelectedSemesterId(activeSemester.id);

      setCanSave(true);
    };

    const wrapper = new ClientPromiseWrapper(toast);
    wrapper.handle(fetchInitialData());
  }, [user, activeSemester]);

  const onSave = async () => {
    const wrapper = new ClientPromiseWrapper(toast);

    setCanSave(false);
    toast('Saving...');
    if (selectedType === MESSAGE_TYPE.TICKET) {
      await wrapper.handle(saveTicket());
    } else if (selectedType === MESSAGE_TYPE.INFORMATION) {
      await wrapper.handle(saveInformation());
    }

    toast.dismiss();
    toast.success(`Message saved to ${selectedType} succesfully!`);
    setCanSave(true);
    updateMessageState();
  };

  const saveTicket = async () => {
    const statusService = new StatusService(user?.accessToken);
    const statuses = await statusService.getAll();
    const newStatus = statuses.find((s) => s.statusName === STATUS.ASSIGNED);

    const dto: CreateTicketDto = {
      statusId: newStatus.id,
      semesterId: selectedSemesterId,
      assignedToId: selectedAdminId,
      categoryId: selectedCategoryId,
      priorityId: selectedPriorityId,
      conversationId: message.conversationId,
      senderName: currentOutlookMessage.sender.emailAddress.name,
      senderEmail: currentOutlookMessage.sender.emailAddress.address,
      subject: firstOutlookMessageFromConversation.subject,
      dueBy: selectedDueDate,
    };

    const ticketService = new TicketService(user?.accessToken);
    await ticketService.add(dto);
  };

  const saveInformation = async () => {
    const dto: CreateInformationDto = {
      semesterId: selectedSemesterId,
      conversationId: message.conversationId,
      senderName: currentOutlookMessage.sender.emailAddress.name,
      senderEmail: currentOutlookMessage.sender.emailAddress.address,
      subject: firstOutlookMessageFromConversation.subject,
    };

    const infoService = new InformationService(user?.accessToken);
    await infoService.add(dto);
  };

  const updateMessageState = () => {
    const newMessages = messages.map((currMessage) => {
      if (currMessage.id === message.id) {
        currMessage.savedAs = selectedType;
      }
      return currMessage;
    });
    setMessages(newMessages);
  };

  const handleOnPriorityChange = (newPriorityId) => {
    const selectedPriority = priorities.find((p) => p.id === newPriorityId);
    let dueDate = new Date();
    dueDate = addHours(dueDate, selectedPriority.deadlineHours + 1);
    dueDate.setSeconds(0);
    dueDate.setMinutes(0);
    setSelectedPriorityId(newPriorityId);
    setSelectedDueDate(dueDate);
  };

  const getSelectedCategory = () =>
    categories?.find((c) => c.id === selectedCategoryId);

  const isSaved = () => {
    return [MESSAGE_TYPE.TICKET, MESSAGE_TYPE.INFORMATION].includes(
      message?.savedAs
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
            <span className="font-bold">Action</span>
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
              <If condition={isSaved()}>
                <Then>
                  <div>
                    This message is already saved as <b>{message?.savedAs}</b>
                  </div>
                </Then>
                <Else>
                  <div className="flex flex-col space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Message Type
                      </label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        defaultValue={types[0]}
                        onChange={(e) => setSelectedType(e.target.value)}>
                        {types.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Semester
                      </label>
                      <select
                        onChange={(e) => setSelectedSemesterId(e.target.value)}
                        defaultValue={activeSemester.id}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        {semesters.map((semester) => (
                          <option value={semester.id} key={semester.id}>
                            {semester.type} Semester {semester.startYear}/
                            {semester.endYear}
                          </option>
                        ))}
                      </select>
                    </div>

                    <If condition={selectedType === MESSAGE_TYPE.TICKET}>
                      <Then>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            onChange={(e) =>
                              setSelectedCategoryId(e.target.value)
                            }
                            defaultValue={selectedCategoryId}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {categories.map((category) => (
                              <option value={category.id} key={category.id}>
                                {category.categoryName}
                              </option>
                            ))}
                          </select>

                          {getSelectedCategory() && (
                            <>
                              <small
                                className="cursor-alias"
                                data-tip
                                data-for="category-description">
                                Hover me to show{' '}
                                <b>{getSelectedCategory().categoryName}</b>{' '}
                                category criteria example.
                              </small>

                              <ReactTooltip
                                id="category-description"
                                place="right"
                                effect="solid">
                                <ul>
                                  {getSelectedCategory()
                                    .description.split(';')
                                    .map((criteria) => (
                                      <li key={criteria}>&#8226; {criteria}</li>
                                    ))}
                                </ul>
                              </ReactTooltip>
                            </>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Priority
                          </label>
                          <select
                            onChange={(e) =>
                              handleOnPriorityChange(e.target.value)
                            }
                            defaultValue={selectedPriorityId}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {priorities.map((priority) => (
                              <option value={priority.id} key={priority.id}>
                                {priority.priorityName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Assign to
                          </label>
                          <select
                            onChange={(e) => setSelectedAdminId(e.target.value)}
                            defaultValue={selectedAdminId}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {admins.map((admin) => (
                              <option value={admin.id} key={admin.id}>
                                {admin.code} - {admin.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Due By
                          </label>
                          <DatePicker
                            selected={selectedDueDate}
                            showTimeSelect
                            dateFormat="Pp"
                            onChange={setSelectedDueDate}
                            className={`${'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                          />
                        </div>
                      </Then>
                    </If>
                  </div>
                </Else>
              </If>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center px-12 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
                  Close
                </button>

                <If condition={!isSaved()}>
                  <Then>
                    <button
                      type="button"
                      disabled={!canSave}
                      onClick={onSave}
                      className={`${
                        canSave
                          ? 'bg-primary hover:bg-primary-dark'
                          : 'bg-gray-300'
                      } inline-flex items-center px-12 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}>
                      {canSave ? `Save as ${selectedType}` : 'Loading ...'}
                    </button>
                  </Then>
                </If>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
