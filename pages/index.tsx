import {
  ChartBarIcon,
  GlobeIcon,
  SpeakerphoneIcon,
} from '@heroicons/react/solid';
import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../components/shared/_Layout';
import { getInitialServerProps } from '../lib/initialize-server-props';
import { withSessionSsr } from '../lib/session';
import { SemestersService } from '../services/SemestersService';
import { AnnouncementsService } from '../services/AnnouncementService';
import { Announcement } from '../models/Announcement';
import AnnouncementContainer from '../components/pages/home/AnnouncementContainer';
import AnnouncementDetailModal from '../components/announcements/AnnouncementDetailModal';
import { useState } from 'react';

type Props = {
  announcements: Announcement[];
};

const Home: NextPage<Props> = ({ announcements }) => {
  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);
  const [openAnnouncement, setOpenAnnouncement] = useState<Announcement>(null);

  return (
    <Layout>
      <AnnouncementDetailModal
        announcement={openAnnouncement}
        isOpen={openAnnouncementModal}
        setIsOpen={setOpenAnnouncementModal}
      />

      <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4'>
        <AnnouncementContainer
          setOpenAnnouncement={setOpenAnnouncement}
          setOpenAnnouncementModal={setOpenAnnouncementModal}
          announcements={announcements}
        />

        <div className='mx-2 p-2 border-2 md:w-1/4 rounded divide-y'>
          <div className='text-lg font-bold mb-3 flex items-center'>
            <ChartBarIcon className='h-5 w-5' />
            <span className='ml-3'>My Request Summary</span>
          </div>

          <div className='p-3'>
            <div className='font-semibold'>Pending</div>
            <div className='text-slate-600 text-4xl'>0</div>
          </div>

          <div className='p-3'>
            <div className='font-semibold'>Awaiting Approval</div>
            <div className='text-slate-600 text-4xl'>0</div>
          </div>

          <div className='p-3'>
            <div className='font-semibold'>Awaiting Updates</div>
            <div className='text-slate-600 text-4xl'>0</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemestersService());
    const announcements = await AnnouncementsService.getBySemester(
      sessionActiveSemester.id,
    );

    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
        announcements,
      },
    };
  },
);

export default Home;
