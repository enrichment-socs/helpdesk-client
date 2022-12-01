import { DocumentReportIcon } from '@heroicons/react/outline';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { useAtom } from 'jotai';
import IndexStore from '../../stores';

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

export default function ReportDashboard() {
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

  const options = {
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Tickets count by categories',
        color: '#333',
      },
    },
  } as const;

  return (
    <div className={`mx-2 p-2 border-2 min-h-[24rem] rounded mt-6`}>
      <div className="text-lg font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <DocumentReportIcon className="h-5 w-5" />
        <span className="ml-3">Report Dashboard</span>
      </div>

      <div className="mx-2 p-2 border-2 rounded mt-6">
        <div className="font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
          <span className="ml-3">Tickets Count For Each Category</span>
        </div>

        <div className="h-[36rem] flex justify-center">
          <Pie options={options} data={data} />
        </div>
      </div>
    </div>
  );
}
