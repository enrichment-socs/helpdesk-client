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

const Home: NextPage = () => {
  return (
    <Layout>
      <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4'>
        <div className='mx-2 p-2 border-2 md:w-3/4 rounded divide-y'>
          <div className='text-lg font-bold mb-3 flex items-center'>
            <SpeakerphoneIcon className='h-5 w-5' />
            <span className='ml-3'>Announcement</span>
          </div>

          {/* Announcement Content */}

          <div className='p-3'>
            <div className='font-semibold'>Dummy Test</div>
            <div className='mt-1 flex divide-x'>
              <div className='pr-3 flex flex-col justify-center items-center text-center md:flex-row'>
                <span className='text-slate-600'>From :</span>
                <span className='md:ml-2 font-medium'>
                  Apr 04, 2022 00:00 AM
                </span>
              </div>
              <div className='px-3 flex flex-col justify-center items-center text-center md:flex-row'>
                <GlobeIcon className='h-5 w-5' />
                <span className='text-slate-600 md:ml-1'>Public</span>
              </div>
              <div className='px-3 flex flex-col justify-center items-center text-center md:flex-row'>
                <span className='text-slate-600'>Priority:</span>
                <span className='md:ml-2 font-medium'>-</span>
              </div>
              <div className='px-3 flex flex-col justify-center items-center text-center md:flex-row'>
                <span className='text-slate-600'>Announcement Type: </span>
                <span className='md: ml-2 font-medium'>-</span>
              </div>
            </div>
          </div>

          <div className='p-3'>
            <div className='font-semibold'>Dummy Test</div>
            <div className='mt-1 flex divide-x'>
              <div className='pr-3 flex flex-col justify-center items-center text-center md:flex-row'>
                <span className='text-slate-600'>From :</span>
                <span className='md:ml-2 font-medium'>
                  Apr 04, 2022 00:00 AM
                </span>
              </div>
              <div className='px-3 flex flex-col justify-center items-center text-center md:flex-row'>
                <GlobeIcon className='h-5 w-5' />
                <span className='text-slate-600 md:ml-1'>Public</span>
              </div>
              <div className='px-3 flex flex-col justify-center items-center text-center md:flex-row'>
                <span className='text-slate-600'>Priority:</span>
                <span className='md:ml-2 font-medium'>-</span>
              </div>
              <div className='px-3 flex flex-col justify-center items-center text-center md:flex-row'>
                <span className='text-slate-600'>Announcement Type: </span>
                <span className='md: ml-2 font-medium'>-</span>
              </div>
            </div>
          </div>
        </div>
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
      },
    };
  },
);

export default Home;
