import { ChartBarIcon } from '@heroicons/react/solid';
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
import { GraphApiService } from '../services/GraphApiService';
import { Message } from '../models/Message';
import { ROLES } from '../shared/constants/roles';
import { useHydrateAtoms } from 'jotai/utils';
import { atom } from 'jotai';
import MessageContainer from '../components/messages/MessageContainer';

type Props = {
  announcements: Announcement[];
  messages: Message[] | [];
};

export const messagesAtom = atom([] as Message[]);

const Home: NextPage<Props> = ({ announcements, messages: serverMessages }) => {
  useHydrateAtoms([[messagesAtom, serverMessages]] as const);

  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);
  const [openAnnouncement, setOpenAnnouncement] = useState<Announcement>(null);

  const session = useSession();
  const user = session?.data?.user as SessionUser;

  return (
    <Layout>
      <AnnouncementDetailModal
        announcement={openAnnouncement}
        isOpen={openAnnouncementModal}
        setIsOpen={setOpenAnnouncementModal}
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

        {user.roleName !== ROLES.USER && <MessageContainer />}
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
    const announcementService = new AnnouncementsService(user.accessToken);
    const graphApiService = new GraphApiService(user.accessToken);

    const announcements = await announcementService.getBySemester(
      sessionActiveSemester.id
    );

    const messages =
      user.roleName === ROLES.USER ? [] : await graphApiService.getMessages();

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
