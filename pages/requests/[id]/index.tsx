import { Transition } from '@headlessui/react';
import { TicketIcon } from '@heroicons/react/solid';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import RequestDetailDetails from '../../../components/request-details/RequestDetailDetails';
import RequestDetailHistory from '../../../components/request-details/RequestDetailHistory';
import RequestDetailInformation from '../../../components/request-details/RequestDetailInformation';
import RequestDetailResolution from '../../../components/request-details/RequestDetailResolution';
import Layout from '../../../widgets/_Layout';
import { AuthHelper } from '../../../shared/libs/auth-helper';
import { ROLES } from '../../../shared/constants/roles';
import { getInitialServerProps } from '../../../shared/libs/initialize-server-props';
import { withSessionSsr } from '../../../shared/libs/session';
import { SemestersService } from '../../../services/SemestersService';

const RequestsDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentTab, setCurrentTab] = useState('Details');
  const [isShowInformation, setIsShowInformation] = useState(false);

  const tabMenuList = ['Details', 'Resolution', 'History'];

  const tabContent =
    currentTab === 'Details' ? (
      <RequestDetailDetails />
    ) : currentTab === 'Resolution' ? (
      <RequestDetailResolution isResolved={true} />
    ) : currentTab === 'History' ? (
      <RequestDetailHistory />
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
            <TicketIcon className="h-10 w-10" />
            <div className="font-medium text-2xl ml-5">
              <div>{id}</div>
              <div>Dummy Subject</div>
              <div className="flex divide-x text-sm mt-1">
                <div className="font-normal text-gray">
                  by
                  <span className="cursor-pointer text-cyan-500 hover:text-blue-700 mx-2">
                    Dummy User
                  </span>
                  on
                  <span className="mx-2">Dummy Date</span>
                </div>
                <div className="font-bold px-2">
                  Due By: <span>Dummy Date</span>
                </div>
              </div>
            </div>
            <div className="ml-auto mr-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold py-2 px-2 rounded"
                onClick={toggleInformation}>
                {isShowInformation ? 'Hide' : 'Show'} Information
              </button>
            </div>
          </div>

          <div className="pt-2">
            {/* Tabs */}

            <div className="text-sm font-medium text-center text-gray-500 border-b-gray-200 dark:text-gray-400 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px">
                {tabMenuList.map((menu, index) => {
                  return (
                    <li className="mr-2" key={index}>
                      <a
                        href="#"
                        className={`inline-block p-4 rounded-t-lg ${
                          currentTab === menu
                            ? 'border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
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
          <RequestDetailInformation />
        </Transition>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemestersService());

    if (!AuthHelper.isLoggedInAndHasRole(session, [ROLES.ADMIN, ROLES.USER]))
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
      },
    };
  }
);

export default RequestsDetailPage;
