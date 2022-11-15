import { BellIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import NotificationItem from '../components/notifications/NotificationItem';

const NavbarNotification = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotification(!showNotification)}
        className="hover:text-primary relative h-full">
        <span className="text-xs absolute top-1 -right-2 text-white rounded-full bg-primary px-1">
          5
        </span>
        <BellIcon className="w-5 h-5" />
      </button>

      <section
        className={`absolute top-12 w-96 right-0 bg-white border shadow transition-all ${
          showNotification ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
        <div className="flex justify-between items-center border-b-2">
          <div className="flex">
            <div className="border-l-4 border-primary"></div>
            <div className="m-3 text-sm font-medium">Notifications</div>
          </div>

          <div className="flex space-x-2 mr-2">
            <button
              title="Mark all as read"
              className="shadow text-white bg-green-600 hover:bg-green-700 py-1 px-3 rounded text-sm">
              <CheckCircleIcon className="w-4 h-4" />
            </button>
            <button
              title="View all"
              className="shadow text-white bg-primary hover:bg-primary-dark py-1 px-3 rounded text-sm">
              View All
            </button>
          </div>
        </div>

        <ul className="max-h-[20rem] overflow-auto">
          {[1, 2, 3].map((notification) => (
            <li key={notification}>
              <NotificationItem />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default NavbarNotification;
