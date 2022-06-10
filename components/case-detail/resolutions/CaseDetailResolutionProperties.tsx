import { format, intervalToDuration } from 'date-fns';
import { If, Then } from 'react-if';
import { Resolution } from '../../../models/Resolution';

type Props = {
  resolution: Resolution;
};

const CaseDetailResolutionProperties = ({ resolution }: Props) => {
  const getResolvedDate = () => {
    if (!resolution) return '-';
    return format(new Date(resolution.created_at), 'dd MMM yyyy, kk:mm');
  };

  return (
    <div className="mt-4">
      <div className="divide-y">
        <div className="font-bold text-sm pb-2">Properties</div>
        <div className="pt-5">
          <table className="border w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="px-6 py-3 font-bold border-r">Resolved date</td>
                <td className="px-6 py-3 break-all">{getResolvedDate()}</td>
              </tr>

              <tr className="border-b">
                <td className="px-6 py-3 font-bold border-r">
                  Also sent as email
                </td>
                <td className="px-6 py-3 break-all">
                  {resolution?.sentToEmail ? 'Yes' : 'No'}
                </td>
              </tr>

              <If condition={resolution?.sentToEmail}>
                <Then>
                  <tr className="border-b">
                    <td className="px-6 py-3 font-bold border-r">Subject</td>
                    <td className="px-6 py-3 break-all">
                      {resolution?.subject || 'No Subject'}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="px-6 py-3 font-bold border-r">
                      To Recipients
                    </td>
                    <td className="px-6 py-3 break-all">
                      {resolution?.toRecipients.split(';').join(',')}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="px-6 py-3 font-bold border-r">
                      Cc Recipients
                    </td>
                    <td className="px-6 py-3 break-all">
                      {resolution?.ccRecipients.split(';').join(', ')}
                    </td>
                  </tr>
                </Then>
              </If>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailResolutionProperties;
