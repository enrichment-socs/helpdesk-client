import { useAtom } from 'jotai';
import { Pie } from 'react-chartjs-2';
import { COLORS } from '../../../shared/constants/color';
import IndexStore from '../../../stores';

export default function HandlerTicketCountByStatusReport() {
  const [ticketsCountByStatuses] = useAtom(
    IndexStore.handlerTicketsCountByStatuses
  );

  const data = {
    labels: ticketsCountByStatuses.map((t) => t.statusName),
    datasets: [
      {
        label: 'Count',
        data: ticketsCountByStatuses.map((t) => t.count),
        backgroundColor: COLORS.CHART_COLORS.slice(
          0,
          ticketsCountByStatuses.length
        ),
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="p-2 border-2 rounded">
      <div className="font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <span className="ml-3">Tickets Count For Each Status</span>
      </div>

      <Pie data={data} />
    </div>
  );
}
