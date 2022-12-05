import { useAtom } from 'jotai';
import { Line } from 'react-chartjs-2';
import IndexStore from '../../../stores';

export default function TicketCountByMonthReport() {
  const [ticketsCountByMonths] = useAtom(IndexStore.ticketsCountByMonths);

  const firstHalfData = {
    labels: ticketsCountByMonths.slice(0, 6).map((t) => t.month),
    datasets: [
      {
        label: 'Count',
        data: ticketsCountByMonths.slice(0, 6).map((t) => t.count),
        hoverOffset: 4,
      },
    ],
  };

  const secondHalfData = {
    labels: ticketsCountByMonths.slice(6, 12).map((t) => t.month),
    datasets: [
      {
        label: 'Count',
        data: ticketsCountByMonths.slice(6, 12).map((t) => t.count),
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

      <Line options={options} data={firstHalfData} />
      <Line options={options} data={secondHalfData} />
    </div>
  );
}
