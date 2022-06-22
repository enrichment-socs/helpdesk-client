import { ChartBarIcon } from '@heroicons/react/solid';

const AdminTicketSummaryContainer = () => {
  const ticketCategories = [
    {
      name: 'Assigned',
      count: 0,
    },
    {
      name: 'Pending',
      count: 0,
    },
    {
      name: 'In Progress',
      count: 0,
    },
    {
      name: 'Resolved',
      count: 0,
    },
    {
      name: 'Closed',
      count: 0,
    },
  ];

  return (
    <div className="mx-2 p-2 border-2 md:w-1/4 rounded divide-y">
      <div className="text-lg font-bold mb-3 flex items-center">
        <ChartBarIcon className="h-5 w-5" />
        <span className="ml-3">My Ticket Summary</span>
      </div>

      {ticketCategories.map((category, idx) => {
        return (
          <div key={idx} className="p-3">
            <div className="font-semibold">{category.name}</div>
            <div className="text-slate-600 text-4xl">{category.count}</div>
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

export default AdminTicketSummaryContainer;
