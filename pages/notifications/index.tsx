import { BellIcon } from '@heroicons/react/outline';
import { NextPage } from 'next';
import NotificationItem from '../../components/notifications/NotificationItem';
import Layout from '../../widgets/_Layout';

const NotificationPage: NextPage = () => {
  return (
    <Layout>
      <div className={`ml-2 mt-5 border-2 rounded divide-y transition`}>
        <div className="text-lg p-2 font-bold flex items-center">
          <BellIcon className="h-5 w-5" />
          <span className="ml-3">Notifications</span>
        </div>
        <div>
          {[1, 2, 3, 4, 5, 6].map((notification) => (
            <NotificationItem showSideList={false} key={notification} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationPage;
