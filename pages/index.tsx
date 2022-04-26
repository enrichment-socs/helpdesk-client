import {
  ChartBarIcon,
  GlobeIcon,
  MailIcon,
  SpeakerphoneIcon,
} from '@heroicons/react/solid';
import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Layout from '../components/shared/_Layout';
import { getInitialServerProps } from '../lib/initialize-server-props';
import { withSessionSsr } from '../lib/session';
import { SemestersService } from '../services/SemestersService';
import { AnnouncementsService } from '../services/AnnouncementService';
import { Announcement } from '../models/Announcement';
import AnnouncementContainer from '../components/pages/home/AnnouncementContainer';
import AnnouncementDetailModal from '../components/announcements/AnnouncementDetailModal';
import { useState } from 'react';
import { SessionUser } from '../models/SessionUser';
import MessagesTable from '../components/messages/MessagesTable';
import MessageDetailModal from '../components/messages/MessageDetailModal';
import { GraphApiService } from '../services/GraphApiService';
import { Message } from '../models/Message';
import { ROLES } from '../lib/constant';

type Props = {
  announcements: Announcement[];
  messages: Message[] | null;
};

const Home: NextPage<Props> = ({ announcements, messages }) => {
  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);
  const [openAnnouncement, setOpenAnnouncement] = useState<Announcement>(null);

  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [openMessageIndex, setOpenMessageIndex] = useState<string>(null);

  return (
    <Layout>
      <AnnouncementDetailModal
        announcement={openAnnouncement}
        isOpen={openAnnouncementModal}
        setIsOpen={setOpenAnnouncementModal}
      />

      <MessageDetailModal
        isOpen={openMessageModal}
        setIsOpen={setOpenMessageModal}
        conversationIndex={openMessageIndex}
      />

      <div>
        <div>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <AnnouncementContainer
              setOpenAnnouncement={setOpenAnnouncement}
              setOpenAnnouncementModal={setOpenAnnouncementModal}
              announcements={announcements}
            />

            <div className="mx-2 p-2 border-2 md:w-1/4 rounded divide-y">
              <div className="text-lg font-bold mb-3 flex items-center">
                <ChartBarIcon className="h-5 w-5" />
                <span className="ml-3">My Request Summary</span>
              </div>

              <div className="p-3">
                <div className="font-semibold">Pending</div>
                <div className="text-slate-600 text-4xl">0</div>
              </div>

              <div className="p-3">
                <div className="font-semibold">Awaiting Approval</div>
                <div className="text-slate-600 text-4xl">0</div>
              </div>

              <div className="p-3">
                <div className="font-semibold">Awaiting Updates</div>
                <div className="text-slate-600 text-4xl">0</div>
              </div>
            </div>
          </div>
        </div>

        {messages && (
          <div className="ml-2 mt-5 p-2 border-2 rounded divide-y">
            <div className="text-lg font-bold mb-3 flex items-center">
              <MailIcon className="h-5 w-5" />
              <span className="ml-3">Messages</span>
            </div>
            <div className="p-1">
              <MessagesTable
                messages={messages}
                setOpenMessageIndex={setOpenMessageIndex}
                setOpenMessageModal={setOpenMessageModal}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemestersService());

    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    const user = session.user as SessionUser;
    const announcements = await AnnouncementsService.getBySemester(
      sessionActiveSemester.id,
      user.accessToken
    );

    const messages =
      user.roleName === ROLES.USER
        ? null
        : await GraphApiService.getMessages(user.accessToken);

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        announcements,
        messages,
      },
    };
  }
);

export default Home;
