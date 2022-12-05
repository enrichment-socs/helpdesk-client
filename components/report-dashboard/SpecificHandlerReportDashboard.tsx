import { DocumentReportIcon } from '@heroicons/react/outline';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { semestersAtom } from '../../atom';
import IndexStore from '../../stores';

export default function SpecificHandlerReportDashboard() {
  const [handlerReportSemesterId, setHandlerReportSemesterId] = useAtom(
    IndexStore.handlerReportSemesterId
  );
  const [semesters] = useAtom(semestersAtom);
  const [admins] = useAtom(IndexStore.admins);
  const [selectedAdminId, setSelectedAdminId] = useState('');

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
      </div>
    </div>
  );
}
