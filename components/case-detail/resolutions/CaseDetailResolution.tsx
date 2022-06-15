import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Else, If, Then } from 'react-if';
import { Case } from '../../../models/Case';
import { CaseStatus } from '../../../models/CaseStatus';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { Resolution } from '../../../models/Resolution';
import { SessionUser } from '../../../models/SessionUser';
import { STATUS } from '../../../shared/constants/status';
import CaseDetailResolutionForm from './CaseDetailResolutionForm';
import CaseDetailResolutionProperties from './CaseDetailResolutionProperties';

type Prop = {
  currCase: Case;
  firstOutlookMessage: OutlookMessage;
  resolution: Resolution;
  setResolution: Dispatch<SetStateAction<Resolution>>;
  caseStatuses: CaseStatus[];
};

const CaseDetailResolution = ({
  currCase,
  firstOutlookMessage,
  resolution,
  setResolution,
  caseStatuses,
}: Prop) => {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const canCreateResolution = () => {
    if (caseStatuses.length == 0) return false;

    const lastIdx = caseStatuses.length - 1;
    return caseStatuses[lastIdx].status.statusName === STATUS.RESOLVED;
  };

  return (
    <>
      <If condition={resolution !== null}>
        <Then>
          <div className="text-sm">
            <div className="divide-y border-b-2">
              <div className="font-bold p-2 px-4 rounded-t bg-gray-200">
                Resolution
              </div>
              <div
                className="border-2 p-5"
                dangerouslySetInnerHTML={{
                  __html: resolution?.resolution,
                }}></div>
            </div>
            <div className="mt-5 divide-y border-b-2">
              <div className="font-bold p-2 px-4 rounded-t bg-gray-200">
                Attachments
              </div>
              <div className="border-2 p-5">There are no files attached</div>
            </div>
          </div>
        </Then>
        <Else>
          {canCreateResolution() ? (
            <CaseDetailResolutionForm
              currCase={currCase}
              firstOutlookMessage={firstOutlookMessage}
              setResolution={setResolution}
            />
          ) : (
            <div>
              Current status must be <b>{STATUS.IN_PROGRESS} </b> to create a
              resolution
            </div>
          )}
        </Else>
      </If>

      {resolution && <CaseDetailResolutionProperties resolution={resolution} />}
    </>
  );
};

export default CaseDetailResolution;
