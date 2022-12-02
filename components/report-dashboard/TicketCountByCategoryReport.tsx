import { useAtom } from 'jotai';
import { Pie } from 'react-chartjs-2';
import IndexStore from '../../stores';

export default function TicketCountByCategoryReport() {
  const [ticketsCountByCategories] = useAtom(
    IndexStore.ticketsCountByCategories
  );

  const data = {
    labels: ticketsCountByCategories.map((t) => t.categoryName),
    datasets: [
      {
        label: 'Count',
        data: ticketsCountByCategories.map((t) => t.count),
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="p-2 border-2 rounded">
      <div className="font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <span className="ml-3">Tickets Count For Each Category</span>
      </div>

      <Pie data={data} />
    </div>
  );
}
