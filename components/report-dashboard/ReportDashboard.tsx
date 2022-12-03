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
  PointElement,
  LineElement,
} from 'chart.js';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { semestersAtom } from '../../atom';
import { SessionUser } from '../../models/SessionUser';
import { ReportService } from '../../services/ReportService';
import IndexStore from '../../stores';
import TicketCountByHandlerReport from './TicketCountByHandlerReport';
import TicketCountByCategoryReport from './TicketCountByCategoryReport';
import TicketCountByPriorityReport from './TicketCountByPriorityReport';
import TicketCountByStatusReport from './TicketCountByStatusReport';
import TicketCountByMonthReport from './TicketCountByMonthReport';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

export default function ReportDashboard() {
  const [semesters] = useAtom(semestersAtom);
  const [reportSemesterId, setReportSemesterId] = useAtom(
    IndexStore.reportSemesterId
  );
  const [ticketStatusCountAdminId] = useAtom(
    IndexStore.ticketStatusCountAdminId
  );
  const [, setTicketsCountByCategories] = useAtom(
    IndexStore.ticketsCountByCategories
  );
  const [, setTicketsCountByPriorities] = useAtom(
    IndexStore.ticketsCountByPriorities
  );
  const [, setTicketsCountByStatuses] = useAtom(
    IndexStore.ticketsCountByStatuses
  );
  const [, setTicketsCountByHandlers] = useAtom(
    IndexStore.ticketsCountByHandlers
  );
  const [, setTicketStatusCountByHandler] = useAtom(
    IndexStore.ticketStatusCountByHandler
  );
  const [, setTicketsCountByMonths] = useAtom(IndexStore.ticketsCountByMonths);

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const reportService = new ReportService(user?.accessToken);

  const onSemesterChange = async (semesterId: string) => {
    const ticketsCountByCategories =
      await reportService.getTicketsCountByCategories(semesterId);
    const ticketsCountByPriorities =
      await reportService.getTicketsCountByPriorities(semesterId);
    const ticketsCountByStatuses =
      await reportService.getTicketsCountByStatuses(semesterId);
    const ticketsCountByHandlers =
      await reportService.getTicketsCountByHandlers(semesterId);
    const ticketStatusCountByHandler =
      await reportService.getTicketsCountByStatuses(
        semesterId,
        ticketStatusCountAdminId
      );
    const ticketsCountByMonths = await reportService.getTicketsCountByMonths(
      semesterId
    );

    setTicketsCountByCategories(ticketsCountByCategories);
    setTicketsCountByPriorities(ticketsCountByPriorities);
    setTicketsCountByStatuses(ticketsCountByStatuses);
    setTicketsCountByHandlers(ticketsCountByHandlers);
    setTicketStatusCountByHandler(ticketStatusCountByHandler);
    setTicketsCountByMonths(ticketsCountByMonths);
  };

  return (
    <div className={`mx-2 p-2 border-2 min-h-[24rem] rounded mt-6`}>
      <div className="text-lg font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <DocumentReportIcon className="h-5 w-5" />
        <span className="ml-3">Report Dashboard</span>
      </div>

      <div className="mx-2 mt-4">
        <label className="text-sm font-medium">Show report for:</label>
        <select
          onChange={(e) => {
            setReportSemesterId(e.target.value);
            onSemesterChange(e.target.value);
          }}
          defaultValue={reportSemesterId}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
          <option value="">All Semester</option>
          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.type} Semester {semester.startYear}/{semester.endYear}
            </option>
          ))}
        </select>
      </div>

      <div className="mx-2 my-4">
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TicketCountByCategoryReport />
          <TicketCountByHandlerReport />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <TicketCountByPriorityReport />
          <TicketCountByStatusReport />
          <TicketCountByMonthReport />
        </div>
      </div>
    </div>
  );
}
