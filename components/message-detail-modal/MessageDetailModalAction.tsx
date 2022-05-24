import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { If, Then } from 'react-if';
import { activeSemesterAtom, semestersAtom } from '../../atom';
import { Category } from '../../models/Category';
import { CreateCaseDto } from '../../models/dto/cases/create-case.dto';
import { Priority } from '../../models/Priority';
import { SessionUser } from '../../models/SessionUser';
import { User } from '../../models/User';
import { CaseService } from '../../services/CaseService';
import { CategoryService } from '../../services/CategoryService';
import { PriorityService } from '../../services/PriorityService';
import { StatusService } from '../../services/StatusService';
import { UserService } from '../../services/UserService';
import { MESSAGE_TYPE } from '../../shared/constants/message-type';
import { STATUS } from '../../shared/constants/status';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';

type Props = {
  onClose: () => void;
  conversationId: string;
};

export default function MessageDetailModalAction({
  onClose,
  conversationId,
}: Props) {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

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
    if (selectedType === MESSAGE_TYPE.CASE) {
      await wrapper.handle(saveCase());
    } else if (selectedType === MESSAGE_TYPE.INFORMATION) {
    }

    toast.dismiss();
    toast.success('Message saved succesfully!');
    setCanSave(true);
  };

  const saveCase = async () => {
    const statusService = new StatusService(user?.accessToken);
    const statuses = await statusService.getAll();
    const newStatus = statuses.find((s) => s.statusName === STATUS.NEW);

    const dto: CreateCaseDto = {
      statusId: newStatus.id,
      semesterId: selectedSemesterId,
      assignedToId: selectedAdminId,
      categoryId: selectedCategoryId,
      priorityId: selectedPriorityId,
      conversationId,
    };

    console.log({ dto });
    const casesService = new CaseService(user?.accessToken);
    await casesService.add(dto);
  };

  return (
    <div className="border border-gray-300 rounded mt-8">
      <div className="bg-gray-300 text-gray-700 p-2">Action</div>
      <div className="p-4 flex flex-col space-y-4">
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
                {semester.type} Semester {semester.startYear}/{semester.endYear}
              </option>
            ))}
          </select>
        </div>

        <If condition={selectedType === 'Case'}>
          <Then>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                defaultValue={selectedCategoryId}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                onChange={(e) => setSelectedPriorityId(e.target.value)}
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
          </Then>
        </If>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-12 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
            Close
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={onSave}
            className={`${
              canSave ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-300'
            } inline-flex items-center px-12 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}>
            {canSave ? `Save as ${selectedType}` : 'Loading ...'}
          </button>
        </div>
      </div>
    </div>
  );
}
