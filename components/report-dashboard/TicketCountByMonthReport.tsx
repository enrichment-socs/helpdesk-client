import { useAtom } from 'jotai';
import { Line } from 'react-chartjs-2';
import IndexStore from '../../stores';

export default function TicketCountByMonthReport() {
  const [ticketsCountByMonths] = useAtom(IndexStore.ticketsCountByMonths);

  const data = {
    labels: ticketsCountByMonths.map((t) => t.month),
    datasets: [
      {
        label: 'Count',
        data: ticketsCountByMonths.map((t) => t.count),
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="p-2 border-2 rounded">
      <div className="font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <span className="ml-3">Ticket Status Count by Month</span>
      </div>

      <Line options={options} data={data} />
    </div>
  );
}
