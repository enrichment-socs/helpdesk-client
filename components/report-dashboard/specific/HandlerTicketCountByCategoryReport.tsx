import { useAtom } from 'jotai';
import { Bar } from 'react-chartjs-2';
import IndexStore from '../../../stores';

export default function HandlerTicketCountByCategoryReport() {
  const [ticketsCountByCategories] = useAtom(
    IndexStore.handlerTicketsCountByCategories
  );

  const data = {
    labels: ticketsCountByCategories.map((t) => t.categoryName),
    datasets: [
      {
        label: 'Count',
        data: ticketsCountByCategories.map((t) => t.count),
        hoverOffset: 4,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    indexAxis: 'y',
  } as const;

  return (
    <div className="p-2 border-2 rounded">
      <div className="font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <span className="ml-3">Tickets Count For Each Category</span>
      </div>

      <Bar options={options} data={data} />
    </div>
  );
}
