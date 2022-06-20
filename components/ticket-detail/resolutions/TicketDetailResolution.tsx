import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Else, If, Then } from 'react-if';
import { Ticket } from '../../../models/Ticket';
import { TicketStatus } from '../../../models/TicketStatus';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { TicketResolution } from '../../../models/TicketResolution';
import { SessionUser } from '../../../models/SessionUser';
import { ROLES } from '../../../shared/constants/roles';
import { STATUS } from '../../../shared/constants/status';
import InfoAlert from '../../../widgets/InfoAlert';
import TicketDetailResolutionForm from './TicketDetailResolutionForm';
import TicketDetailResolutionProperties from './TicketDetailResolutionProperties';

type Prop = {
  ticket: Ticket;
  firstOutlookMessage: OutlookMessage;
  resolution: TicketResolution;
  setResolution: Dispatch<SetStateAction<TicketResolution>>;
  ticketStatuses: TicketStatus[];
};

const TicketDetailResolution = ({
  ticket,
  firstOutlookMessage,
  resolution,
  setResolution,
  ticketStatuses,
}: Prop) => {
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const canCreateResolution = () => {
    if (ticketStatuses.length == 0) return false;

    return getCurrentStatus() === STATUS.RESOLVED;
  };

  const getCurrentStatus = () => {
    const lastIdx = ticketStatuses.length - 1;
    return ticketStatuses[lastIdx].status.statusName;
  };

  if (!resolution && user?.roleName === ROLES.USER) {
    return (
      <InfoAlert message="There is currently no resolution for this ticket. Please wait, the admin is currently processing this ticket." />
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
                message={`Please close this ticket by marking it as <b>Closed</b> in <b>Manage Ticket</b> tab`}
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
            <TicketDetailResolutionForm
              ticket={ticket}
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

      {resolution && (
        <TicketDetailResolutionProperties resolution={resolution} />
      )}
    </>
  );
};

export default TicketDetailResolution;
