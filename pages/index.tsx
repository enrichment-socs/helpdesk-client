import { ChartBarIcon, MailIcon, RefreshIcon } from '@heroicons/react/solid';
import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Layout from '../widgets/_Layout';
import { getInitialServerProps } from '../shared/libs/initialize-server-props';
import { withSessionSsr } from '../shared/libs/session';
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
import { ROLES } from '../shared/constants/roles';
import toast from 'react-hot-toast';
import { useHydrateAtoms } from 'jotai/utils';
import { atom, useAtom } from 'jotai';

type Props = {
  announcements: Announcement[];
  messages: Message[] | [];
};

const messagesAtom = atom([] as Message[]);

const Home: NextPage<Props> = ({ announcements, messages: serverMessages }) => {
  useHydrateAtoms([[messagesAtom, serverMessages]] as const);

  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);
  const [openAnnouncement, setOpenAnnouncement] = useState<Announcement>(null);

  const [messages, setMessages] = useAtom(messagesAtom);
  const [isSync, setIsSync] = useState(false);

  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [openMessageIndex, setOpenMessageIndex] = useState<string>(null);

  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const syncAndGetMessages = async () => {
    await GraphApiService.syncMessages(user.accessToken);
    return GraphApiService.getMessages(user.accessToken);
  };

  const handleSyncMessages = async () => {
    setIsSync(true);
    const messages = await toast.promise(syncAndGetMessages(), {
      loading: 'Syncing Messages',
      success: 'Messages synced',
      error: (e) => e.toString(),
    });
    setMessages(messages);
    setIsSync(false);
  };

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

        {user.roleName !== ROLES.USER && (
          <div className="ml-2 mt-5 p-2 border-2 rounded divide-y">
            <div className="flex justify-between">
              <div className="text-lg font-bold mb-3 flex items-center">
                <MailIcon className="h-5 w-5" />
                <span className="ml-3">Messages</span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleSyncMessages}
                  disabled={isSync}
                  className={`${
                    isSync ? 'bg-gray-300' : 'bg-primary hover:bg-primary-dark'
                  } inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}>
                  Sync <RefreshIcon className="w-4 h-4 block ml-1" />
                </button>
              </div>
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
        ? []
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
