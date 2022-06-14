import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid';
import { Case, Switch } from 'react-if';
import { CaseStatus } from '../../../models/CaseStatus';
import { Resolution } from '../../../models/Resolution';
import { STATUS } from '../../../shared/constants/status';
import CaseStatusChangeLogTable from './CaseStatusChangeLogTable';

type Props = {
  caseStatuses: CaseStatus[];
  resolution: Resolution;
};

export default function CaseDetailManage({ caseStatuses, resolution }: Props) {
  const getCurrentStatus = () => {
    if (caseStatuses.length == 0) return 'No Status';
    return caseStatuses[caseStatuses.length - 1].status.statusName;
  };

  const renderReasonInputText = () => {
    return (
      <div className="mt-3">
        <label>Reason to change status: </label>
        <input
          type="text"
          className="border border-gray-300 rounded p-2 w-full outline-none"
        />
      </div>
    );
  };

  return (
    <section className="text-gray-800">
      <div>
        <h2 className="font-semibold text-lg mb-2">Case Status Change Log</h2>
        <CaseStatusChangeLogTable caseStatuses={caseStatuses} />
      </div>

      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-2">Manage Status</h2>
        <div>
          Current Status:{' '}
          <input
            className="border border-gray-300 rounded p-2 w-full"
            type="text"
            disabled
            value={getCurrentStatus()}
          />
        </div>

        <Switch>
          <Case condition={getCurrentStatus() === STATUS.NEW}>
            <div className="flex space-x-4 justify-end mt-3">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Change Status to{' '}
                <span className="font-bold ml-1">{STATUS.IN_PROGRESS}</span>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </Case>

          <Case condition={getCurrentStatus() === STATUS.IN_PROGRESS}>
            <div>
              {renderReasonInputText()}

              <div className="flex space-x-4 justify-end mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-gray-800 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600">
                  Change Status to{' '}
                  <span className="font-bold ml-1">{STATUS.PENDING}</span>
                </button>

                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600">
                  Change Status to{' '}
                  <span className="font-bold ml-1">{STATUS.RESOLVED}</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Case>

          <Case condition={getCurrentStatus() === STATUS.PENDING}>
            {renderReasonInputText()}

            <div className="flex space-x-4 justify-end mt-3">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Change Status to{' '}
                <span className="font-bold ml-1">{STATUS.IN_PROGRESS}</span>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </Case>

          <Case condition={getCurrentStatus() === STATUS.RESOLVED}>
            <div>
              {renderReasonInputText()}

              <div className="flex space-x-4 justify-between mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <ChevronLeftIcon className="h-5 w-5" />
                  Change Status to{' '}
                  <span className="font-bold ml-1">{STATUS.IN_PROGRESS}</span>
                </button>

                <button
                  type="button"
                  disabled={!resolution}
                  className={`${
                    resolution
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400'
                  } inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white focus:outline-none`}>
                  Change Status to{' '}
                  <span className="font-bold ml-1">{STATUS.CLOSED}</span>{' '}
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Case>

          <Case condition={getCurrentStatus() === STATUS.CLOSED}>
            <div className="rounded-md bg-green-50 p-4 mt-4 border border-green-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon
                    className="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Case is closed, view the resolution in <b>Resolution</b> tab
                  </p>
                </div>
              </div>
            </div>
          </Case>
        </Switch>
      </div>
    </section>
  );
}
