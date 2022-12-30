import { TicketIcon } from '@heroicons/react/solid';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import TicketDetailDetails from '../../../components/ticket-detail/details/TicketDetailDetails';
import TicketDetailHistory from '../../../components/ticket-detail/histories/TicketDetailHistory';
import Layout from '../../../widgets/_Layout';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { Ticket } from '../../../models/Ticket';
import { SessionUser } from '../../../models/SessionUser';
import { TicketService } from '../../../services/TicketService';
import { format } from 'date-fns';
import { GraphApiService } from '../../../services/GraphApiService';
import { CONTENT_ID_REGEX } from '../../../shared/constants/regex';
import { TicketResolutionService } from '../../../services/TicketResolutionService';
import { TicketResolution } from '../../../models/TicketResolution';
import { TicketStatusService } from '../../../services/TicketStatusService';
import { TicketStatus } from '../../../models/TicketStatus';
import TicketDetailManage from '../../../components/ticket-detail/manage-ticket/TicketDetailManage';
import { StatusService } from '../../../services/StatusService';
import { Status } from '../../../models/Status';
import { OutlookMessageClientHelper } from '../../../shared/libs/outlook-message-client-helper';
import { ClientPromiseWrapper } from '../../../shared/libs/client-promise-wrapper';
import toast from 'react-hot-toast';
import { TicketDueDateService } from '../../../services/TicketDueDateService';
import { TicketDueDate } from '../../../models/TicketDueDate';
import TicketDetailStore from '../../../stores/tickets/[id]';
import { useAtom, useSetAtom } from 'jotai';
import { TicketUtils } from '../../../shared/libs/ticket-utils';
import { TicketHistoryService } from '../../../services/TicketHistoryService';
import { TicketHistory } from '../../../models/TicketHistory';
import { OutlookMessage } from '../../../models/OutlookMessage';
import useHydrateAndSyncAtom from '../../../hooks/useHydrateAndSyncAtom';

type Props = {
  ticket: Ticket;
  resolutions: TicketResolution;
  ticketStatuses: TicketStatus[];
  statuses: Status[];
  ticketDueDates: TicketDueDate[];
  ticketHistories: TicketHistory[];
};

const TicketDetailPage: NextPage<Props> = ({
  ticket,
  resolutions,
  ticketStatuses,
  ticketDueDates,
  ticketHistories,
  statuses,
}) => {
  useHydrateAndSyncAtom([
    [
      TicketDetailStore.ticket,
      useSetAtom(TicketDetailStore.ticket as any),
      ticket,
    ],
    [
      TicketDetailStore.resolutions,
      useSetAtom(TicketDetailStore.resolutions),
      resolutions,
    ],
    [
      TicketDetailStore.ticketStatuses,
      useSetAtom(TicketDetailStore.ticketStatuses),
      ticketStatuses,
    ],
    [
      TicketDetailStore.ticketDueDates,
      useSetAtom(TicketDetailStore.ticketDueDates),
      ticketDueDates,
    ],
    [
      TicketDetailStore.statuses,
      useSetAtom(TicketDetailStore.statuses),
      statuses,
    ],
    [
      TicketDetailStore.ticketHistories,
      useSetAtom(TicketDetailStore.ticketHistories),
      ticketHistories,
    ],
  ]);

  const [currentTab, setCurrentTab] = useState('Details');

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user.accessToken);
  const [outlookMessages, setOutlookMessages]: [OutlookMessage[], any] =
    useAtom(TicketDetailStore.outlookMessages);
  const [, setAttachmentArrays] = useAtom(TicketDetailStore.attachmentsArray);

  useEffect(() => {
    const wrapper = new ClientPromiseWrapper(toast);
    wrapper.handle(fetchMessages());

    return () => {
      setOutlookMessages(null);
      setAttachmentArrays([]);
    };
  }, []);

  const fetchMessages = async () => {
    const messagesByConversation =
      await graphApiService.getMessagesByConversation(ticket.conversationId);

    for (let i = 0; i < messagesByConversation.length; i++) {
      const useUniqueBody = i !== 0;
      const message = messagesByConversation[i];
      const bodyContent = useUniqueBody
        ? message.uniqueBody.content
        : message.body.content;
      const contentIds = bodyContent.match(CONTENT_ID_REGEX);

      let attachments = [];
      if (contentIds || message.hasAttachments) {
        const messageAttachment = await graphApiService.getMessageAttachments(
          message.id
        );

        const helper = new OutlookMessageClientHelper(message);
        let processedContent = helper.replaceBodyImageWithCorrectSource(
          messageAttachment.value,
          useUniqueBody
        );

        if (useUniqueBody) message.uniqueBody.content = processedContent;
        else message.body.content = processedContent;

        attachments = messageAttachment.value;
      }

      setAttachmentArrays((prev) => [...prev, attachments]);
    }

    setOutlookMessages(messagesByConversation);
  };

  const getTabMenuList = () => {
    const tabMenuList = ['Details', 'Manage Ticket', 'History'];
    if (user?.roleName === ROLES.USER)
      return tabMenuList.filter((t) => t !== 'Manage Ticket');
    return tabMenuList;
  };

  const getTabContent = () => {
    switch (currentTab) {
      case 'Details':
        return <TicketDetailDetails />;
      case 'Manage Ticket':
        return <TicketDetailManage />;
      case 'History':
        return <TicketDetailHistory />;
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <div
          className={`mx-2 p-2 border-2 rounded divide-y transition-all ease-in-out delay-300`}>
          <div className="flex items-center pb-3">
            <div className="rounded-full border border-gray-300 p-2">
              <TicketIcon className="h-10 w-10 text-gray-400" />
            </div>
            <div className="font-medium text-2xl ml-5">
              <div>
                <span className="text-gray-500">[#{ticket.number}]</span>{' '}
                {ticket.subject}
              </div>
              <div className="flex flex-col md:flex-row md:divide-x text-sm mt-1">
                <div className="font-normal text-gray">
                  by
                  <span className="font-bold mx-2 ">{ticket.senderName}</span>
                  <span className="block md:inline mt-2 md:mt-0">
                    on{' '}
                    <span className="mr-0 md:mr-2">
                      {outlookMessages
                        ? format(
                            new Date(outlookMessages[0].receivedDateTime),
                            'dd MMM yyyy, kk:mm'
                          )
                        : '-- --- ----'}
                    </span>
                  </span>
                </div>
                <div className="md:px-2 mt-2 md:mt-0 font-normal">
                  Due By:{' '}
                  <span className="font-bold">
                    {format(new Date(ticket.dueBy), 'dd MMM yyyy, kk:mm')}
                  </span>
                </div>
              </div>
              <div className="text-sm mt-1">
                <span className="font-normal">Current Status </span>:{' '}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-gray-100">
                  {TicketUtils.getCurrentStatus(ticketStatuses)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {/* Tabs */}

            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <ul className="flex overflow-auto -mb-px">
                {getTabMenuList().map((menu, index) => {
                  return (
                    <li className="mr-2" key={index}>
                      <button
                        className={`font-medium inline-block p-4 rounded-t-lg ${
                          currentTab === menu
                            ? 'border-b-2 border-primary active'
                            : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentTab(menu);
                        }}>
                        {menu}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Tab Content */}
            <div className="p-4">{getTabContent()}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, params }) {
    const { session, sessionActiveSemester, ...globalProps } =
      await getInitialServerProps(req);

    if (
      !AuthHelper.isLoggedInAndHasRole(session, [
        ROLES.ADMIN,
        ROLES.USER,
        ROLES.SUPER_ADMIN,
      ])
    )
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    const user = session.user as SessionUser;
    const ticketService = new TicketService(user?.accessToken);
    const resolutionService = new TicketResolutionService(user?.accessToken);
    const ticketStatusService = new TicketStatusService(user?.accessToken);
    const statusService = new StatusService(user?.accessToken);
    const ticketDueDateService = new TicketDueDateService(user?.accessToken);
    const ticketHistoryService = new TicketHistoryService(user?.accessToken);

    const ticket = await ticketService.get(params.id as string);

    if (!ticket) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const resolutions = await resolutionService.getByTicketId(ticket.id);

    const ticketStatuses = await ticketStatusService.getAllByTicketId(
      ticket.id
    );
    const statuses = await statusService.getAll();
    const ticketDueDates = await ticketDueDateService.getAllByTicketId(
      ticket.id
    );

    const ticketHistories = await ticketHistoryService.getAllByTicketId(
      ticket.id
    );

    return {
      props: {
        ...globalProps,
        session,
        sessionActiveSemester,
        ticket,
        resolutions,
        ticketStatuses,
        ticketDueDates,
        ticketHistories,
        statuses,
      },
    };
  }
);

export default TicketDetailPage;
