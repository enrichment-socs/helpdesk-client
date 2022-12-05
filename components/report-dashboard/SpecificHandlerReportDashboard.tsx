import { DocumentReportIcon } from '@heroicons/react/outline';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { semestersAtom } from '../../atom';
import { SessionUser } from '../../models/SessionUser';
import { ReportService } from '../../services/ReportService';
import IndexStore from '../../stores';
import HandlerTicketCountByCategoryReport from './specific/HandlerTicketCountByCategoryReport';
import HandlerTicketCountByMonthReport from './specific/HandlerTicketCountByMonthReport';
import HandlerTicketCountByPriorityReport from './specific/HandlerTicketCountByPriorityReport';
import HandlerTicketCountByStatusReport from './specific/HandlerTicketCountByStatusReport';

export default function SpecificHandlerReportDashboard() {
  const [handlerReportSemesterId, setHandlerReportSemesterId] = useAtom(
    IndexStore.handlerReportSemesterId
  );
  const [semesters] = useAtom(semestersAtom);
  const [admins] = useAtom(IndexStore.admins);
  const [selectedAdminId, setSelectedAdminId] = useState('');

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const reportService = new ReportService(user?.accessToken);

  const [, setTicketsCountByCategories] = useAtom(
    IndexStore.handlerTicketsCountByCategories
  );
  const [, setTicketsCountByPriorities] = useAtom(
    IndexStore.handlerTicketsCountByPriorities
  );
  const [, setTicketsCountByStatuses] = useAtom(
    IndexStore.handlerTicketsCountByStatuses
  );
  const [, setTicketsCountByMonths] = useAtom(
    IndexStore.handlerTicketsCountByMonths
  );

  const onAdminChange = async (userId: string) => {
    await refetchData(handlerReportSemesterId, userId);
  };

  const onSemesterChange = async (semesterId: string) => {
    await refetchData(semesterId, selectedAdminId);
  };

  const refetchData = async (semesterId: string, userId: string) => {
    const [
      ticketsCountByCategories,
      ticketsCountByPriorities,
      ticketsCountByStatuses,
      ticketsCountByMonths,
    ] = await toast.promise(
      Promise.all([
        reportService.getTicketsCountByCategories(semesterId, userId),
        reportService.getTicketsCountByPriorities(semesterId, userId),
        reportService.getTicketsCountByStatuses(semesterId, userId),
        reportService.getTicketsCountByMonths(semesterId, userId),
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
    setTicketsCountByMonths(ticketsCountByMonths);
  };

  return (
    <div className={`mx-2 p-2 border-2 min-h-[24rem] rounded mt-6`}>
      <div className="text-lg font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <DocumentReportIcon className="h-5 w-5" />
        <span className="ml-3">Report Dashboard for Specific Handler</span>
      </div>

      <div className="mx-2 mt-4">
        <div>
          <label className="text-sm font-medium">Show report for:</label>
          <select
            onChange={(e) => {
              setSelectedAdminId(e.target.value);
              onAdminChange(e.target.value);
            }}
            defaultValue={''}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
            <option disabled value="">
              --- SELECT ADMIN ---
            </option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">For semester:</label>
          <select
            onChange={(e) => {
              setHandlerReportSemesterId(e.target.value);
              onSemesterChange(e.target.value);
            }}
            disabled={selectedAdminId === ''}
            defaultValue={handlerReportSemesterId}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md ${
              selectedAdminId ? '' : 'bg-gray-300'
            }`}>
            <option value="">All Semester</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.type} Semester {semester.startYear}/{semester.endYear}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <HandlerTicketCountByCategoryReport />
          <HandlerTicketCountByMonthReport />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <HandlerTicketCountByPriorityReport />
          <HandlerTicketCountByStatusReport />
        </div>
      </div>
    </div>
  );
}
