import { format, intervalToDuration } from 'date-fns';
import { Case } from '../../../models/Case';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { Resolution } from '../../../models/Resolution';
import SkeletonLoading from '../../../widgets/SkeletonLoading';

type Props = {
  outlookMessage: OutlookMessage | null;
  currCase: Case;
  resolution: Resolution;
};

const CaseDetailProperties = ({
  outlookMessage,
  currCase,
  resolution,
}: Props) => {
  const isFetching = () => outlookMessage === null;

  const getClientName = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      outlookMessage.sender.emailAddress.name
    );
  };

  const getClientEmail = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      outlookMessage.sender.emailAddress.address
    );
  };

  const getCategory = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      currCase.category.categoryName
    );
  };

  const getPriority = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      currCase.priority.priorityName
    );
  };

  const getStatus = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      currCase.status.statusName
    );
  };

  const getAssignedTo = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      currCase.assignedTo.name
    );
  };

  const getSource = () => {
    return isFetching() ? <SkeletonLoading width="100%" /> : 'Email';
  };

  const getReceivedDate = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      format(new Date(outlookMessage.receivedDateTime), 'dd MMM yyyy, kk:mm')
    );
  };

  const getRespondedDate = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      format(new Date(currCase.created_at), 'dd MMM yyyy, kk:mm')
    );
  };

  const getDueBy = () => {
    return isFetching() ? (
      <SkeletonLoading width="100%" />
    ) : (
      format(new Date(currCase.dueBy), 'dd MMM yyyy, kk:mm')
    );
  };

  const getResolvedDate = () => {
    if (isFetching()) return <SkeletonLoading width="100%" />;
    if (!resolution) return '-';
    return format(new Date(resolution.created_at), 'dd MMM yyyy, kk:mm');
  };

  const getTimeElapsed = () => {
    if (isFetching()) return <SkeletonLoading width="100%" />;
    const receivedDate = new Date(outlookMessage.receivedDateTime);
    const currDate = new Date();
    const interval = intervalToDuration({ start: receivedDate, end: currDate });
    return `${interval.days} days ${interval.hours} hours ${interval.minutes} minutes ${interval.seconds} seconds`;
  };

  return (
    <div className="divide-y">
      <div className="font-bold text-sm pb-2">Properties</div>
      <div className="pt-5">
        <table className="border w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Client Name</td>
              <td className="px-6 py-3 break-all">{getClientName()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Client Email</td>
              <td className="px-6 py-3 break-all">{getClientEmail()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Category</td>
              <td className="px-6 py-3 break-all">{getCategory()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Priority</td>
              <td className="px-6 py-3 break-all">{getPriority()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Status</td>
              <td className="px-6 py-3 break-all">{getStatus()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Assigned To</td>
              <td className="px-6 py-3 break-all">{getAssignedTo()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Source</td>
              <td className="px-6 py-3 break-all">{getSource()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Received at</td>
              <td className="px-6 py-3 break-all">{getReceivedDate()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Responded at</td>
              <td className="px-6 py-3 break-all">{getRespondedDate()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Due By</td>
              <td className="px-6 py-3 break-all">{getDueBy()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Resolved Date</td>
              <td className="px-6 py-3 break-all">{getResolvedDate()}</td>
            </tr>

            <tr className="border-b">
              <td className="px-6 py-3 font-bold border-r">Time Elapsed</td>
              <td className="px-6 py-3 break-all">{getTimeElapsed()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaseDetailProperties;
