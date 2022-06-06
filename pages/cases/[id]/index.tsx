import { Transition } from '@headlessui/react';
import { TicketIcon } from '@heroicons/react/solid';
import { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import CaseDetailDetails from '../../../components/case-detail/details/CaseDetailDetails';
import CaseDetailHistory from '../../../components/case-detail/histories/CaseDetailHistory';
import CaseDetailInformation from '../../../components/case-detail/information/CaseDetailInformation';
import CaseDetailResolution from '../../../components/case-detail/resolutions/CaseDetailResolution';
import Layout from '../../../widgets/_Layout';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { SemesterService } from '../../../services/SemesterService';
import { Case } from '../../../models/Case';
import { SessionUser } from '../../../models/SessionUser';
import { CaseService } from '../../../services/CaseService';
import { format } from 'date-fns';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { GraphApiService } from '../../../services/GraphApiService';
import SkeletonLoading from '../../../widgets/SkeletonLoading';
import { OutlookMessageAttachmentValue } from '../../../models/OutlookMessageAttachment';
import { CONTENT_ID_REGEX } from '../../../shared/constants/regex';

type Props = {
  currCase: Case;
};

const RequestsDetailPage: NextPage<Props> = ({ currCase }) => {
  const router = useRouter();
  const { id } = router.query;
  const [currentTab, setCurrentTab] = useState('Details');
  const [isShowInformation, setIsShowInformation] = useState(false);

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user.accessToken);
  const [outlookMessages, setOutlookMessages] =
    useState<OutlookMessage[]>(null);
  const [attachmentArrays, setAttachmentArrays] = useState<
    OutlookMessageAttachmentValue[][]
  >([]);

  const replaceBodyImageWithCorrectSource = (
    bodyContent: string,
    contentIds: string[],
    attachments: OutlookMessageAttachmentValue[]
  ) => {
    let content = bodyContent;
    attachments
      .filter(
        (att) => att.isInline && contentIds.includes(`cid:${att.contentId}`)
      )
      .forEach((attachment) => {
        content = content.replace(
          `cid:${attachment.contentId}`,
          `data:image/jpeg;base64,${attachment.contentBytes}`
        );
      });
    return content;
  };

  const fetchMessages = async () => {
    const messagesByConversation =
      await graphApiService.getMessagesByConversation(currCase.conversationId);

    for (const message of messagesByConversation) {
      const bodyContent = message.body.content;
      const contentIds = bodyContent.match(CONTENT_ID_REGEX);

      if (contentIds || message.hasAttachments) {
        const messageAttachment = await graphApiService.getMessageAttachments(
          message.id
        );

        let processedContent = replaceBodyImageWithCorrectSource(
          bodyContent,
          contentIds,
          messageAttachment.value
        );

        message.body.content = processedContent;
        attachmentArrays.push(messageAttachment.value);

        setAttachmentArrays((prev) => [...prev, messageAttachment.value]);
      }
    }

    setOutlookMessages(messagesByConversation);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const tabMenuList = ['Details', 'Resolution', 'History'];

  const tabContent =
    currentTab === 'Details' ? (
      <CaseDetailDetails
        outlookMessages={outlookMessages}
        attachmentsArrays={attachmentArrays}
      />
    ) : currentTab === 'Resolution' ? (
      <CaseDetailResolution isResolved={true} />
    ) : currentTab === 'History' ? (
      <CaseDetailHistory />
    ) : null;

  const toggleInformation = () => {
    setIsShowInformation((prevState) => !prevState);
  };

  return (
    <Layout>
      <div className="flex flex-col a space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div
          className={`mx-2 p-2 border-2 ${
            isShowInformation ? 'md:w-3/4' : 'md:w-full'
          }  rounded divide-y transition-all ease-in-out delay-300`}>
          <div className="flex items-center pb-3">
            <div className="rounded-full border border-gray-300 p-2">
              <TicketIcon className="h-10 w-10 text-gray-400" />
            </div>
            <div className="font-medium text-2xl ml-5">
              <div>{currCase.subject}</div>
              <div className="flex divide-x text-sm mt-1">
                <div className="font-normal text-gray">
                  by
                  <span className="font-bold mx-2">{currCase.senderName}</span>
                  on
                  {outlookMessages ? (
                    <span className="mx-2">
                      {format(
                        new Date(outlookMessages[0].receivedDateTime),
                        'dd MMM yyyy, kk:mm'
                      )}
                    </span>
                  ) : (
                    <SkeletonLoading width="100%" />
                  )}
                </div>
                <div className="px-2 font-normal">
                  Due By:{' '}
                  <span className="font-bold">
                    {format(new Date(currCase.dueBy), 'dd MMM yyyy, kk:mm')}
                  </span>
                </div>
              </div>
            </div>
            <div className="ml-auto mr-5">
              <button
                className="bg-primary hover:bg-primary-dark text-sm text-white font-bold py-2 px-2 rounded"
                onClick={toggleInformation}>
                {isShowInformation ? 'Hide' : 'Show'} Information
              </button>
            </div>
          </div>

          <div className="pt-2">
            {/* Tabs */}

            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <ul className="flex flex-wrap -mb-px">
                {tabMenuList.map((menu, index) => {
                  return (
                    <li className="mr-2" key={index}>
                      <a
                        href="#"
                        className={`inline-block p-4 rounded-t-lg ${
                          currentTab === menu
                            ? 'border-b-2 border-primary active'
                            : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentTab(menu);
                        }}>
                        {menu}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Tab Content */}
            <div className="p-4">{tabContent}</div>
          </div>
        </div>

        <Transition
          show={isShowInformation}
          enter="transition duration-300 ease-in-out"
          enterFrom="transform scale-50 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-300 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-50 opacity-0">
          <CaseDetailInformation currCase={currCase} />
        </Transition>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, params }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemesterService());

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.ADMIN, ROLES.USER]))
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    const user = session.user as SessionUser;
    const caseService = new CaseService(user?.accessToken);
    const currCase = await caseService.get(params.id as string);

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        currCase,
      },
    };
  }
);

export default RequestsDetailPage;