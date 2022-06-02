import { ArchiveIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { casesAtom } from '../../pages/requests';
import RequestsTable from '../requests/RequestsTable';

export default function RequestContainer() {
  const [cases] = useAtom(casesAtom);

  return (
    <>
      <div className="ml-2 mt-5 p-2 border-2 rounded divide-y">
        <div className="flex justify-between">
          <div className="text-lg font-bold mb-3 flex items-center">
            <ArchiveIcon className="h-5 w-5" />
            <span className="ml-3">Cases</span>
          </div>
        </div>
        <div className="p-1">
          <RequestsTable cases={cases} />
        </div>
      </div>
    </>
  );
}
