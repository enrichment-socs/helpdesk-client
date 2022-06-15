import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { Case as SwitchCase, Switch } from 'react-if';
import { Case } from '../../../models/Case';
import { CaseStatus } from '../../../models/CaseStatus';
import { CreateCaseStatusDto } from '../../../models/dto/case-statuses/create-case-status.dto';
import { Resolution } from '../../../models/Resolution';
import { SessionUser } from '../../../models/SessionUser';
import { Status } from '../../../models/Status';
import { CaseStatusService } from '../../../services/CaseStatusService';
import { STATUS } from '../../../shared/constants/status';
import { ClientPromiseWrapper } from '../../../shared/libs/client-promise-wrapper';
import { confirm } from '../../../shared/libs/confirm-dialog-helper';
import CaseStatusChangeLogTable from './CaseStatusChangeLogTable';

type Props = {
  caseStatuses: CaseStatus[];
  resolution: Resolution;
  statuses: Status[];
  currCase: Case;
  setCaseStatuses: Dispatch<SetStateAction<CaseStatus[]>>;
};

export default function CaseDetailManage({
  caseStatuses,
  resolution,
  statuses,
  currCase,
  setCaseStatuses,
}: Props) {
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const caseStatusService = new CaseStatusService(user?.accessToken);

  const [reason, setReason] = useState('');

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
          onChange={(e) => setReason(e.target.value)}
          value={reason}
        />
      </div>
    );
  };

  const updateStatus = async (
    statusName: string,
    shouldFillReason: boolean
  ) => {
    const status = statuses.find((s) => s.statusName === statusName);
    if (!status) {
      toast.error('Specified status does not exist, please contact developer');
      return;
    }

    if (shouldFillReason && !reason) {
      toast.error('Reason must be filled');
      return;
    }

    const message = `Are you sure you want to change the status from <b>${getCurrentStatus()}</b> to <b>${statusName}</b> ${
      shouldFillReason ? `with reason: <b>${reason}</b>` : ''
    } ?`;
    if (await confirm(message)) {
      toast('Updating status...');

      const dto: CreateCaseStatusDto = {
        caseId: currCase.id,
        reason: reason || null,
        statusId: status.id,
        userId: user.id,
      };

      const wrapper = new ClientPromiseWrapper(toast);
      const addedStatus = await wrapper.handle(caseStatusService.add(dto));

      setCaseStatuses([...caseStatuses, addedStatus]);
      setReason('');
      toast.dismiss();
      toast.success('Status updated succesfully');
    }
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
          <SwitchCase condition={getCurrentStatus() === STATUS.NEW}>
            <div className="flex space-x-4 justify-end mt-3">
              <button
                onClick={() => updateStatus(STATUS.IN_PROGRESS, false)}
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Change Status to{' '}
                <span className="font-bold ml-1">{STATUS.IN_PROGRESS}</span>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </SwitchCase>

          <SwitchCase condition={getCurrentStatus() === STATUS.IN_PROGRESS}>
            <div>
              {renderReasonInputText()}

              <div className="flex space-x-4 justify-end mt-3">
                <button
                  onClick={() => updateStatus(STATUS.PENDING, true)}
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-gray-800 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600">
                  Change Status to{' '}
                  <span className="font-bold ml-1">{STATUS.PENDING}</span>
                </button>

                <button
                  onClick={() => updateStatus(STATUS.RESOLVED, true)}
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600">
                  Change Status to{' '}
                  <span className="font-bold ml-1">{STATUS.RESOLVED}</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </SwitchCase>

          <SwitchCase condition={getCurrentStatus() === STATUS.PENDING}>
            {renderReasonInputText()}

            <div className="flex space-x-4 justify-end mt-3">
              <button
                onClick={() => updateStatus(STATUS.IN_PROGRESS, true)}
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Change Status to{' '}
                <span className="font-bold ml-1">{STATUS.IN_PROGRESS}</span>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </SwitchCase>

          <SwitchCase condition={getCurrentStatus() === STATUS.RESOLVED}>
            <div>
              {renderReasonInputText()}
              {!resolution && (
                <small className="text-red-400 font-medium">
                  *You must create a resolution before closing this case.
                </small>
              )}

              <div className="flex space-x-4 justify-between mt-3">
                <button
                  onClick={() => updateStatus(STATUS.IN_PROGRESS, true)}
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <ChevronLeftIcon className="h-5 w-5" />
                  Change Status to{' '}
                  <span className="font-bold ml-1">{STATUS.IN_PROGRESS}</span>
                </button>

                <button
                  onClick={() => updateStatus(STATUS.CLOSED, true)}
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
          </SwitchCase>

          <SwitchCase condition={getCurrentStatus() === STATUS.CLOSED}>
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
          </SwitchCase>
        </Switch>
      </div>
    </section>
  );
}
