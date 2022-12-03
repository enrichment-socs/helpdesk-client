import { DocumentReportIcon } from '@heroicons/react/outline';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import TicketCountByCategoryReport from './TicketCountByCategoryReport';
import TicketCountByPriorityReport from './TicketCountByPriorityReport';
import TicketCountByStatusReport from './TicketCountByStatusReport';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function ReportDashboard() {
  return (
    <div className={`mx-2 p-2 border-2 min-h-[24rem] rounded mt-6`}>
      <div className="text-lg font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <DocumentReportIcon className="h-5 w-5" />
        <span className="ml-3">Report Dashboard</span>
      </div>

      <div className="mx-2 my-4">
        <TicketCountByCategoryReport />

        <div className="grid grid-cols-3 gap-4 mt-4">
          <TicketCountByPriorityReport />
          <TicketCountByStatusReport />
        </div>
      </div>
    </div>
  );
}
