import { DocumentReportIcon } from '@heroicons/react/outline';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { semestersAtom } from '../../atom';
import { SessionUser } from '../../models/SessionUser';
import { ReportService } from '../../services/ReportService';
import IndexStore from '../../stores';
import TicketCountByHandlerReport from './general/TicketCountByHandlerReport';
import TicketCountByCategoryReport from './general/TicketCountByCategoryReport';
import TicketCountByPriorityReport from './general/TicketCountByPriorityReport';
import TicketCountByStatusReport from './general/TicketCountByStatusReport';
import TicketCountByMonthReport from './general/TicketCountByMonthReport';
import toast from 'react-hot-toast';

export default function GeneralReportDashboard() {
  const [semesters] = useAtom(semestersAtom);
  const [reportSemesterId, setReportSemesterId] = useAtom(
    IndexStore.reportSemesterId
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
  const [, setTicketsCountByMonths] = useAtom(IndexStore.ticketsCountByMonths);

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const reportService = new ReportService(user?.accessToken);

  const onSemesterChange = async (semesterId: string) => {
    const [
      ticketsCountByCategories,
      ticketsCountByPriorities,
      ticketsCountByStatuses,
      ticketsCountByHandlers,
      ticketsCountByMonths,
    ] = await toast.promise(
      Promise.all([
        reportService.getTicketsCountByCategories(semesterId),
        reportService.getTicketsCountByPriorities(semesterId),
        reportService.getTicketsCountByStatuses(semesterId),
        reportService.getTicketsCountByHandlers(semesterId),
        reportService.getTicketsCountByMonths(semesterId),
      ]),
      {
        error: (e) => {
          console.error(e);
          return 'Error when re-fetching report data';
        },
        loading: 'Updating report data...',
        success: 'Report updated',
      }
    );

    setTicketsCountByCategories(ticketsCountByCategories);
    setTicketsCountByPriorities(ticketsCountByPriorities);
    setTicketsCountByStatuses(ticketsCountByStatuses);
    setTicketsCountByHandlers(ticketsCountByHandlers);
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
