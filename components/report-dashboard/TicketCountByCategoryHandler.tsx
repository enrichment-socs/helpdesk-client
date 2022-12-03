import { useAtom } from 'jotai';
import { Bar } from 'react-chartjs-2';
import IndexStore from '../../stores';

export default function TicketCountByHandlerReport() {
  const [ticketsCountByHandlers] = useAtom(IndexStore.ticketsCountByHandlers);
  console.log({ ticketsCountByHandlers });

  const data = {
    labels: ticketsCountByHandlers.map((t) => t.handlerName),
    datasets: [
      {
        label: 'Count',
        data: ticketsCountByHandlers.map((t) => t.count),
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
        <span className="ml-3">Tickets Count For Each Handler</span>
      </div>

      <Bar options={options} data={data} />
    </div>
  );
}
