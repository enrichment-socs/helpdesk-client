import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { Pie } from 'react-chartjs-2';
import { SessionUser } from '../../models/SessionUser';
import { ReportService } from '../../services/ReportService';
import IndexStore from '../../stores';

export default function TicketStatusCountByHandlerReport() {
  const [ticketStatusCountByHandler, setTicketStatusCountByHandler] = useAtom(
    IndexStore.ticketStatusCountByHandler
  );
  const [admins] = useAtom(IndexStore.admins);
  const [, setTicketStatusCountAdminId] = useAtom(
    IndexStore.ticketStatusCountAdminId
  );
  const [reportSemesterId] = useAtom(IndexStore.reportSemesterId);

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const reportService = new ReportService(user?.accessToken);

  const data = {
    labels: ticketStatusCountByHandler.map((t) => t.statusName),
    datasets: [
      {
        label: 'Count',
        data: ticketStatusCountByHandler.map((t) => t.count),
        hoverOffset: 4,
      },
    ],
  };

  const onAdminChange = async (userId: string) => {
    const newData = await reportService.getTicketsCountByStatuses(
      reportSemesterId,
      userId
    );
    setTicketStatusCountByHandler(newData);
  };

  return (
    <div className="p-2 border-2 rounded">
      <div className="font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <span className="ml-3">Ticket Status Count for Specific Handler</span>
      </div>

      <div>
        <select
          onChange={(e) => {
            setTicketStatusCountAdminId(e.target.value);
            onAdminChange(e.target.value);
          }}
          defaultValue={admins[0].id}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.name}
            </option>
          ))}
        </select>
      </div>

      <Pie data={data} />
    </div>
  );
}
