import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Else, If, Then } from 'react-if';
import { Case } from '../../../models/Case';
import { CaseStatus } from '../../../models/CaseStatus';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { Resolution } from '../../../models/Resolution';
import { SessionUser } from '../../../models/SessionUser';
import { ROLES } from '../../../shared/constants/roles';
import { STATUS } from '../../../shared/constants/status';
import InfoAlert from '../../../widgets/InfoAlert';
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

    return getCurrentStatus() === STATUS.RESOLVED;
  };

  const getCurrentStatus = () => {
    const lastIdx = caseStatuses.length - 1;
    return caseStatuses[lastIdx].status.statusName;
  };

  if (!resolution && user?.roleName === ROLES.USER) {
    return (
      <InfoAlert message="There is currently no resolution for this case. Please wait, the admin is currently processing this case." />
    );
  }

  return (
    <>
      <If condition={resolution !== null}>
        <Then>
          {getCurrentStatus() === STATUS.RESOLVED &&
            user?.roleName !== ROLES.USER && (
              <InfoAlert
                className="mb-4"
                message={`Please close this case by marking it as <b>Closed</b> in <b>Manage Case</b> tab`}
              />
            )}

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
              Current status must be <b>{STATUS.RESOLVED} </b> to create a
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
