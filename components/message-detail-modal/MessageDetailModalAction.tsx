import { useState } from 'react';
import { If, Then } from 'react-if';

type Props = {
  onClose: () => void;
};

export default function MessageDetailModalAction({ onClose }: Props) {
  const types = ['Case', 'Information'];
  const [selectedType, setSelectedType] = useState(types[0]);

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
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue="Canada">
            <option>USA</option>
            <option>Canada</option>
            <option>EU</option>
          </select>
        </div>

        <If condition={selectedType === 'Case'}>
          <Then>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                defaultValue="Canada">
                <option>USA</option>
                <option>Canada</option>
                <option>EU</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                defaultValue="Canada">
                <option>USA</option>
                <option>Canada</option>
                <option>EU</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                defaultValue="Canada">
                <option>USA</option>
                <option>Canada</option>
                <option>EU</option>
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
            className="inline-flex items-center px-12 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Save as {selectedType}
          </button>
        </div>
      </div>
    </div>
  );
}
