import { ChartBarIcon } from '@heroicons/react/solid';

const AdminRequestSummaryContainer = () => {
  const requestCategories = [
    {
      name: 'New Case',
      count: 0,
    },
    {
      name: 'Pending',
      count: 0,
    },
    {
      name: 'On Process',
      count: 0,
    },
    {
      name: 'Completed',
      count: 0,
    },
  ];

  return (
    <div className="mx-2 p-2 border-2 md:w-1/4 rounded divide-y">
      <div className="text-lg font-bold mb-3 flex items-center">
        <ChartBarIcon className="h-5 w-5" />
        <span className="ml-3">My Request Summary</span>
      </div>

      {requestCategories.map((requestCategory, idx) => {
        return (
          <div key={idx} className="p-3">
            <div className="font-semibold">{requestCategory.name}</div>
            <div className="text-slate-600 text-4xl">
              {requestCategory.count}
            </div>
          </div>
        );
      })}

      {/* <div className="p-3">
        <div className="font-semibold">Pending</div>
        <div className="text-slate-600 text-4xl">0</div>
      </div>

      <div className="p-3">
        <div className="font-semibold">Awaiting Approval</div>
        <div className="text-slate-600 text-4xl">0</div>
      </div>

      <div className="p-3">
        <div className="font-semibold">Awaiting Updates</div>
        <div className="text-slate-600 text-4xl">0</div>
      </div> */}
    </div>
  );
};

export default AdminRequestSummaryContainer;
