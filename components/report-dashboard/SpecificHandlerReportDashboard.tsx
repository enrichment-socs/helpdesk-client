import { DocumentReportIcon } from '@heroicons/react/outline';

export default function SpecificHandlerReportDashboard() {
  return (
    <div className={`mx-2 p-2 border-2 min-h-[24rem] rounded mt-6`}>
      <div className="text-lg font-bold mb-1 flex items-center border-b border-gray-300 pb-3">
        <DocumentReportIcon className="h-5 w-5" />
        <span className="ml-3">Report Dashboard for Specific Handler</span>
      </div>

      <div className="mx-2 mt-4">
        <label className="text-sm font-medium">Show report for:</label>
        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
          <option value="">LL20-2</option>
        </select>
      </div>
    </div>
  );
}
